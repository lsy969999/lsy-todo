import { useEffect, useState } from "react";
import { Col, Form, Pagination, Row, Table } from "react-bootstrap";

const dbName = 'LsyTodoDatabase'
const storeName = 'Todo'

const Home = () => {
    const [db, setDb] = useState<IDBDatabase>();

    useEffect(()=>{
        const request = indexedDB.open(dbName,1)
        request.onerror = (event) => {
            const tar = event.target as IDBOpenDBRequest
            console.error(`Database error: ${tar.error}`);
        }
        request.onupgradeneeded = (event) => {
            const tar = event.target as IDBOpenDBRequest
            const oldVersion = event.oldVersion;
            console.log('onupgradeneeded, oldVersion', oldVersion)
            if (oldVersion < 1) {
                const db = tar.result;
                const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true })
                store.createIndex('id', 'id', { unique: true })
                console.log('store created, name: ', store.name)
            }
        }
        request.onsuccess = (event) => {
            const tar = event.target as IDBOpenDBRequest
            setDb(tar.result)
        }
        request.onblocked = () => {
            console.log('다른탭에서 접근')
        }
    }, [])
    console.log(db)
    return (
        <>
            <Row>
                <Col>
                    {/* <div className='text-end'>
                        <label htmlFor="todo-input">todo-input</label>
                        <input type='text' id='todo-input' />
                        <button>search</button>
                    </div> */}
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Search</Form.Label>
                            <Form.Control type="text"/>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                    <Col>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>created at</th>
                                    <th>todo</th>
                                    <th>checked</th>
                                    <th>checked at</th>
                                    <th>edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2</td>
                                    <td>2123123</td>
                                    <td>todo title</td>
                                    <td>ok</td>
                                    <td>21231</td>
                                    <td>
                                        <button
                                            data-bs-toggle="modal"
                                            data-bs-target="#todo-modal-edit"
                                        >edit</button>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                {/* <tr>
                                    <td colSpan={ 3 }>sum</td>
                                    <td>1</td>
                                    <td colSpan={ 2 }></td>
                                </tr> */}
                            </tfoot>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className='text-end me-3'>
                            <button >New</button>
                        </div>
                    </Col>
                </Row>
                <Row>
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
        </>
    )
}

export default Home