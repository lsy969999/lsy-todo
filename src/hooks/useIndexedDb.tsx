import { useEffect, useState } from "react"

const dbName = 'LsyTodoDatabase'

const useIndexedDb = <T extends { id: number }>(storeName: string) => {
    const [idb, setIdb] = useState<IDBDatabase>();
    useEffect(() => {
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
            setIdb(tar.result)
            console.log('db on success')
        }
        request.onblocked = () => {
            console.log('다른탭에서 접근 TODO')
        }
    }, [storeName])

    const idbAdd = (obj: Omit<T, 'id'>): Promise<number> => {
        return new Promise((resolve, reject) => {
            const tx = idb?.transaction(storeName, 'readwrite');
            if (!tx) {
                console.error('[handleDbTodoAdd] tx is null')
                reject('[handleDbTodoAdd] tx is null')
                return
            }
    
            const store = tx.objectStore(storeName)
            const request = store.add(obj)
            let result: number;
            request.onsuccess = (event) => {
                const tar = event.target as IDBRequest
                result = tar.result
            }
            request.onerror = (event) => {
                console.error('[handleDbTodoAdd] request error', event)
                reject('[handleDbTodoAdd] request error' + event)
            }
    
            tx.oncomplete = () => {
                // console.log('[handleDbTodoAdd] tx oncomplete')
                resolve(result)
            }
            tx.onerror = (event) => {
                console.error('[handleDbTodoAdd] tx onerror', event)
                reject('[handleDbTodoAdd] tx onerror' + event)
            }
        })
    }

    const idbDelete = (id: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            const tx = idb?.transaction(storeName, 'readwrite');
            if (!tx) {
                console.error('[handleDbTodoDelete] tx is null')
                reject('[handleDbTodoDelete] tx is null')
                return
            }

            const store = tx.objectStore(storeName)
            const request = store.delete(id)
            let result: undefined;
            request.onsuccess = (event) => {
                const tar = event.target as IDBRequest;
                result = tar.result
                // console.log('!!!!!asdf',result)
            }
            request.onerror = (event) => {
                const request = event.target as IDBRequest;
                console.log('[handleDbTodoDelete] request onerror' + request.error?.message)
                reject('[handleDbTodoDelete] request onerror' + request.error?.message)
            }

            tx.oncomplete = () => {
                // console.log('[handleDbTodoDelete] tx on complete')
                resolve(result)
            }
            tx.onerror = (event) => {
                console.log('[handleDbTodoDelete] tx on error', event)
                reject('[handleDbTodoDelete] tx on error' + event)
            }
        })
    }

    const idbUpdate = (obj: T): Promise<number> => {
        return new Promise((resolve, reject) => {
            const tx = idb?.transaction(storeName, 'readwrite');
            if (!tx) {
                console.error('[handleDbTodoCheckToggle] tx is null')
                reject('[handleDbTodoCheckToggle] tx is null')
                return
            }
    
            const store = tx.objectStore(storeName)
            const request = store.put(obj)
            
            let result: number 
            request.onsuccess = (event) => {
                const tar = event.target as IDBRequest;
                result = tar.result
            }
            request.onerror = (event) => {
                const request = event.target as IDBRequest;
                // console.log('[handleDbTodoCheckToggle] request onerror' + request.error?.message)
                reject('[handleDbTodoCheckToggle] request onerror' + request.error?.message)
            }
    
            tx.oncomplete = () => {
                console.log('[handleDbTodoCheckToggle] tx on complete', result)
                resolve(result)
            }
            tx.onerror = (event) => {
                console.log('[handleDbTodoCheckToggle] tx on error', event)
                reject('[handleDbTodoCheckToggle] tx on error' + event)
            }
        })
    }

    const idbGetAll = (): Promise<T[]> => {
        return new Promise((resolve, reject) => {
            const tx = idb?.transaction(storeName, 'readwrite');
            if (!tx) {
                console.error('[handleDbTodoCheckToggle] tx is null')
                reject('[handleDbTodoCheckToggle] tx is null')
                return
            }
    
            const store = tx.objectStore(storeName)
            const request = store.getAll()
            
            let result: T[]
            request.onsuccess = (event) => {
                const tar = event.target as IDBRequest;
                result = tar.result
            }
            request.onerror = (event) => {
                const request = event.target as IDBRequest;
                // console.log('[handleDbTodoCheckToggle] request onerror' + request.error?.message)
                reject('[handleDbTodoCheckToggle] request onerror' + request.error?.message)
            }
    
            tx.oncomplete = () => {
                console.log('[handleDbTodoCheckToggle] tx on complete', result)
                resolve(result)
            }
            tx.onerror = (event) => {
                console.log('[handleDbTodoCheckToggle] tx on error', event)
                reject('[handleDbTodoCheckToggle] tx on error' + event)
            }
        })
    }

    const idbGetById = (id: number): Promise<T> => {
        return new Promise((resolve, reject) => {
            const tx = idb?.transaction(storeName, 'readwrite');
            if (!tx) {
                // console.error('[idbGetById] tx is null')
                reject('[idbGetById] tx is null')
                return
            }
    
            const store = tx.objectStore(storeName)
            const request = store.get(id)
            let result: T
            request.onsuccess = (event) => {
                const tar = event.target as IDBRequest
                result = tar.result
            }
            request.onerror = (event) => {
                const request = event.target as IDBRequest;
                console.log('[handleDbTodoById] request onerror' + request.error?.message)
                reject('[handleDbTodoById] request onerror' + request.error?.message)
            }
    
            tx.oncomplete = () => {
                // console.log('[handleDbTodoById] tx on complete')
                resolve(result)
            }
            tx.onerror = (event) => {
                console.log('[handleDbTodoById] tx on error', event)
                reject('[handleDbTodoById] tx on error' + event)
            }
        })
    }

    const fn = {
        idbGetAll, idbGetById, idbAdd, idbUpdate, idbDelete
    }

    return {idb, fn}
}

export default useIndexedDb

/** todo 페이지 조회 */
// const handleDbTodoListPage = useCallback(() => {
//     const tx = db?.transaction(storeName, 'readwrite');
//     if (!tx) {
//         console.error('[handleDbTodoListPage] tx is null')
//         return
//     }
//     let lastCursor = null;
//     const store = tx.objectStore(storeName);
//     const index = store.index('id');
//     let range;
//     const cursorRequest = index.openCursor(range, 'next');
//     if (lastCursor) {
//         range = IDBKeyRange.lowerBound(lastCursor, true);
//     } else {
//         range = IDBKeyRange.lowerBound(0);
//     }
//     let count = 0;
//     const pageSize = 50;
//     const result: TodoOBj[] = []
//     cursorRequest.onsuccess = (event) => {
//         const tar = event.target as IDBRequest<IDBCursorWithValue>;
//         const cursor = tar.result
//         if (cursor && count < pageSize) {
//             // console.log(cursor.value);
//             result.push(cursor.value)
//             lastCursor = cursor.value.id;
//             count++;
//             cursor.continue();
//         }
//     }

//     tx.oncomplete = () => {
//         console.log('[handleDbTodoListPage] tx on complete')

//         setTodos(result)
//     }
//     tx.onerror = (event) => {
//         console.log('[handleDbTodoListPage] tx on error', event)
//     }
// }, [ db ])