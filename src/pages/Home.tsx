import { format } from "date-fns";
import JSConfetti from "js-confetti";
import { useCallback, useEffect, useState } from "react";
import { Col, Form, Pagination, Row, Table, Button, Modal, InputGroup, Fade } from "react-bootstrap";
import useIndexedDb from "../hooks/useIndexedDb";

const storeName = 'Todo'

type TodoOBj = {
    id: number,
    todo: string,
    createdAt: Date,
    checked: boolean,
    checkedAt: undefined | Date
}

const Home = () => {
    const {idb: db, fn} = useIndexedDb<TodoOBj>(storeName);

    /** todo 추가 */
    const handleDbTodoAdd = (todo: string): Promise<number> => {
        const newTodo = {
            todo,
            createdAt: new Date(),
            checked: false,
            checkedAt: undefined,
        }
        return fn.idbAdd(newTodo)
    }

    /** Todo 한건 조회 */
    const handleDbTodoById = async (id: number): Promise<TodoOBj> => {
        return fn.idbGetById(id)
    }

    /** Todo check toggle */
    const handleDbTodoCheckToggle = async (id: number) => {
        const oldValue = await fn.idbGetById(id);
        const newValue = { ...oldValue }
        newValue.checked = !oldValue.checked
        newValue.checkedAt = new Date()
        return fn.idbUpdate(newValue)
    }

    const handleDbTodoDelete = (id: number) => {
        return fn.idbDelete(id)
    }

    const handleDbTodoList = useCallback(() => {
        if (db){
            return fn.idbGetAll()
        }
    }, [db])

    const [newTodoTxt, setNewTotoTxt] = useState<string>('')
    const [newTodoShow, setNewTodoShow] = useState(false);
    const handleNewTodoClose = () => setNewTodoShow(false)
    const handleNewTodoShow = () => setNewTodoShow(true)
    const handleNewTodoTxtOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTotoTxt(event.target.value)
    }

    // const [detailTodoTxt, setDetailTodoTxt] = useState<string>('')
    const [detailTodoShow, setDetailTodoShow] = useState(false);
    const handleDetailTodoClose = () => setDetailTodoShow(false);
    const handleDetailTodoShow = () => setDetailTodoShow(true);
    const [detailTodo, setDetailTodo] = useState<TodoOBj>();

    const [detailTodoEditMode, setDetailTodoEditMode] = useState(false);
    
    const [todos, setTodos] = useState<TodoOBj[]>([])

    /// db 초기 로드
    useEffect(()=>{
        (async () => {
            if(db){
                const dbtodos = await handleDbTodoList()
                if(dbtodos) {
                    setTodos(dbtodos)
                }
            }
        })()
    }, [db, handleDbTodoList])

    const [toggleTapped, setToggleTapped] = useState(false)
    useTodoConfetti(todos, toggleTapped);
    return (
        <>
            <Row>
                <Col>
                    {/* <div className='text-end'>
                        <label htmlFor="todo-input">todo-input</label>
                        <input type='text' id='todo-input' />
                        <button>search</button>
                    </div> */}
                    {/* <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Search</Form.Label>
                            <Form.Control type="text"/>
                        </Form.Group>
                    </Form> */}
                </Col>
            </Row>
            <Row>
                    <Col>
                        <Table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    {/* <th>created at</th> */}
                                    <th>todo</th>
                                    <th>done</th>
                                    {/* <th>checked at</th> */}
                                    {/* <th>edit</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    todos.map((item, index) => {
                                        return <tr key={ index }>
                                            <td>{index+1}</td>
                                            {/* <td>{format(item.createdAt, 'yyyy-mm-dd')}</td> */}
                                            <td
                                                style={ {
                                                    textDecoration: item.checked ? 'line-through' : 'none'
                                                } }
                                                onClick={ async () => {
                                                    const todo = await handleDbTodoById(item.id)
                                                    setDetailTodo(todo)
                                                    handleDetailTodoShow();
                                                } }
                                            >{item.todo}</td>
                                            <td
                                                onClick={ async () => {
                                                    await handleDbTodoCheckToggle(item.id)
                                                    // handleDbTodoListPage()
                                                    const dbTodos = await handleDbTodoList()
                                                    if(dbTodos){
                                                        setTodos(dbTodos)
                                                    }
                                                    setToggleTapped(true)
                                                } }
                                            >{item.checked ? 'o':'x'}</td>
                                            {/* <td>{item.checkedAt ? format(item.checkedAt, 'yyyy-mm-dd') : '-'}</td> */}
                                            {/* <td>
                                                <Button>Edit</Button>
                                            </td> */}
                                    </tr>
                                    })
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={ 2 }>complete</td>
                                    <td>{`${todos.filter(t=>t.checked).length}/${todos.length}`}</td>
                                </tr>
                            </tfoot>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className='text-end me-3'>
                            <Button onClick={ handleNewTodoShow }>New</Button>
                        </div>
                    </Col>
                </Row>

                {/* <TodoPagination/> */}
                

                {/* todo 추가 모달 */}
                <TodoModal
                    show={ newTodoShow }
                    onHide={ handleNewTodoClose }
                    modalHead={
                        <Modal.Title>New Todo</Modal.Title>
                    }
                    modalBody={
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Todo</Form.Label>
                                <Form.Control value={ newTodoTxt } onChange={ handleNewTodoTxtOnChange } type="text"/>
                            </Form.Group>
                        </Form>
                    }
                    modalFooter={
                        <Button variant="info"
                            onClick={ async ()=>{
                                handleDbTodoAdd(newTodoTxt)
                                setNewTotoTxt('')
                                handleNewTodoClose()
                                // handleDbTodoListPage()
                                const dbTodos = await handleDbTodoList()
                                if(dbTodos){
                                    setTodos(dbTodos)
                                }
                            } }
                        >Save</Button>
                    }
                />

                {/* todo 상세 보기 모달 */}
                <TodoModal
                    show={ detailTodoShow }
                    onHide={ () => {
                        handleDetailTodoClose()
                        setDetailTodoEditMode(false)
                    } }
                    modalHead={
                        <Modal.Title>Todo</Modal.Title>
                    }
                    modalBody={
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Todo</Form.Label>
                                <Form.Control value={ detailTodo?.todo } disabled={!detailTodoEditMode} type="text"/>
                                <Form.Label>CreatedAt</Form.Label>
                                <Form.Control value={ detailTodo ? format(detailTodo.createdAt, 'yyyy-MM-dd HH:Mi:ss') : '' } disabled={!detailTodoEditMode} type="text"/>
                                <Form.Label>Done</Form.Label>
                                <InputGroup.Checkbox checked disabled={!detailTodoEditMode}/>
                                <Form.Label>DoneAt</Form.Label>
                                <Form.Control value={ detailTodo?.checkedAt ? format(detailTodo.checkedAt, 'yyyy-MM-dd HH:Mi:ss') : '' } disabled={!detailTodoEditMode} type="text"/>
                            </Form.Group>
                        </Form>
                    }
                    modalFooter={
                        <>
                            {
                                !detailTodoEditMode &&
                                <Button variant="secondary"
                                    onClick={ () => {
                                        setDetailTodoEditMode(true)
                                    } }
                                >Edit</Button>
                            }
                            {
                                detailTodoEditMode &&
                                <Button variant="info"
                                    onClick={ () => {
                                        setDetailTodoEditMode(false)
                                    } }
                                >Save</Button>
                            }
                            <Button variant="danger"
                                onClick={ async () => {
                                    if(detailTodo) {
                                        await handleDbTodoDelete(detailTodo.id)
                                        handleDetailTodoClose()
                                        // handleDbTodoListPage()
                                        const dbTodos = await handleDbTodoList()
                                        if(dbTodos) {
                                            setTodos(dbTodos)
                                        }
                                    }
                                } }
                            >Delete</Button>
                        </>
                    }
                />
        </>
    )
}

export default Home

const useTodoConfetti = (todos: TodoOBj[], toggleTapped: boolean) => {
    useEffect(()=>{
        if (todos.length > 0 && toggleTapped) {
            console.log('con',todos)
            const doneCount = todos.filter(t=>t.checked).length
            const totalCount = todos.length
            console.log(doneCount, totalCount)
            
            if (doneCount === totalCount) {
                console.log('confetti!!!!')
                const jsConfetti = new JSConfetti()
                jsConfetti.addConfetti({
                    // emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸', '🦄'],
                 })
            }
        }
    }, [todos, toggleTapped])
}

const TodoPagination = () => {
    return <Row>
        <Col>
            <Pagination className='justify-content-center'>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Ellipsis />

                <Pagination.Item>{10}</Pagination.Item>
                <Pagination.Item>{11}</Pagination.Item>
                <Pagination.Item active>{12}</Pagination.Item>
                <Pagination.Item>{13}</Pagination.Item>
                <Pagination.Item disabled>{14}</Pagination.Item>

                <Pagination.Ellipsis />
                <Pagination.Item>{20}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>
        </Col>
    </Row>
}

type TodoTableProps = {
    todos: TodoOBj[]
}
const TodoTable = ({ todos }: TodoTableProps) => {
    return <>
    </>
}


type TodoNewModalProps = {
    show: boolean,
    onHide: () => void,
    modalHead: React.ReactNode,
    modalBody:  React.ReactNode,
    modalFooter:  React.ReactNode,
}
const TodoModal = ({ show, onHide, modalHead, modalBody, modalFooter }: TodoNewModalProps) => {
    return <>
        <Modal show={ show } onHide={ onHide } backdrop="static">
            <Modal.Header closeButton>
                { modalHead }
                {/* <Modal.Title>New Todo</Modal.Title> */}
            </Modal.Header>
            <Modal.Body>
                { modalBody }
                {/* <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Todo</Form.Label>
                        <Form.Control value={ newTodoTxt } onChange={ handleNewTodoTxtOnChange } type="text"/>
                    </Form.Group>
                </Form> */}
            </Modal.Body>
            <Modal.Footer>
                { modalFooter }
                {/* <Button variant="info"
                    onClick={ async ()=>{
                        handleDbTodoAdd(newTodoTxt)
                        setNewTotoTxt('')
                        handleNewTodoClose()
                        // handleDbTodoListPage()
                        const dbTodos = await handleDbTodoList()
                        if(dbTodos){
                            setTodos(dbTodos)
                        }
                    } }
                >Save</Button> */}
            </Modal.Footer>
        </Modal>
    </>
}