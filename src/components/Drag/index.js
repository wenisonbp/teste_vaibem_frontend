import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from 'react-modal';
import moment from 'moment';
import { stages } from '@src/data';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import api from '@src/services/api';

moment.locale('pt-br');

toast.configure();

Modal.setAppElement('#root');


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        minWidth: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
    overlay: {
        zIndex: 2000,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
};


const QuoteApp = () => {


    const [fieldsTasks, setFieldsTasks] = useState({});

    const [fieldsTasksAlter, setFieldsTasksAlter] = useState({});

    const [openIsModalAlter, setIsOpenModalAlter] = useState(false);

    const [dataTasks, setDataTasks] = useState(() => {

        let stageInitialState = {};

        stages.forEach(item => {
            stageInitialState = {
                ...stageInitialState,
                [item.status]: []
            }
        })

        return stageInitialState;

    });


    useEffect(() => {

        loadTasks();

    }, []);


    const reorder = (getList, startIndex, endIndex) => {

        const result = Array.from(getList);

        const [removed] = result.splice(startIndex, 1);

        result.splice(endIndex, 0, removed);

        return result;
    };

    const move = (source, destination, droppableSource, droppableDestination) => {

        const sourceClone = Object.assign(source, []);
        const destClone = Object.assign(destination, []);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        removed.stage = droppableDestination.droppableId;

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };

    const grid = 8;

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: 'none',
        padding: 0,
        margin: `0 0 ${grid}px 0`,
        background: isDragging ? 'lightgreen' : '',
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? '#3329292b' : 'white',
        padding: grid,
        width: 250,
        margin: 10
    });


    const loadTasks = async () => {

        try {

            let ckeckLogin = localStorage.getItem('token');

            const response = await api.get("/task", {
                headers: {
                    'Authorization': `Bearer ${ckeckLogin}`
                }
            });

            response.data.forEach(element => {

                let itemState = Object.assign(dataTasks[element.stage]);

                itemState.push(element);

                setDataTasks({
                    ...dataTasks,
                    [element.stage]: itemState
                })

            });


        } catch (error) {

            localStorage.removeItem('token');
            window.location.reload();

        }

    }

    const createTask = async (e) => {

        let ckeckLogin = localStorage.getItem('token');

        try {

            e.preventDefault();

            const { data } = await api.post('/task_store', {
                fieldsTasks
            }, {
                headers: {
                    'Authorization': `Bearer ${ckeckLogin}`
                }
            })


            const modal = document.getElementById('addTaskModal');

            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('style', 'display: none');
            const modalBackdrops = document.getElementsByClassName('modal-backdrop');
            document.body.removeChild(modalBackdrops[0]);

            document.getElementById("form_add_task").reset();

            let itemState = Object.assign(dataTasks['triagem']);

            itemState.push(data);

            setDataTasks({
                ...dataTasks,
                ['triagem']: itemState
            })


            toast.success('Registro criado com sucesso!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        } catch (error) {

            localStorage.removeItem('token');
            window.location.reload();

        }


    }

    const showTask = async (idTask) => {

        let ckeckLogin = localStorage.getItem('token');

        try {

            const { data } = await api.get('/task_show/' + idTask, {
                headers: {
                    'Authorization': `Bearer ${ckeckLogin}`
                }
            })

            setFieldsTasksAlter({
                ...fieldsTasksAlter,
                ['alter_id']: data.id,
                ['alter_title']: data.title,
                ['alter_requester_name']: data.requester_name,
                ['alter_requester_email']: data.requester_email,
                ['alter_description']: data.description,
                ['alter_due_date']: moment(data.due_date).format('YYYY-MM-DDTHH:mm'),
                ['alter_comment']: data.comment,
                ['alter_stage']: data.stage
            });

            openModalAlter();

        } catch (error) {

            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
            } else {
                toast.error('Erro ao carregar o registro!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

        }


    }

    const updateTask = async (e) => {

        e.preventDefault()

        let ckeckLogin = localStorage.getItem('token');

        try {

            const { data } = await api.post('/task_update', {
                fieldsTasksAlter
            }, {
                headers: {
                    'Authorization': `Bearer ${ckeckLogin}`
                }
            })


            if (data.message === "Sucesso") {

                const {alter_id, alter_stage} = fieldsTasksAlter;
                let getList = dataTasks[alter_stage].filter(item => {
                    return item.id === alter_id
                });

                console.log(alter_id)
                console.log(getList)

                closeModalAlter()

                toast.success('Registro alterado com sucesso!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            } else {

                throw new Error({ error: 'Falha ao criar o registro' });

            }



        } catch (error) {

            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
            } else {
                toast.error('Erro ao salvar o registro!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

        }


    }

    const deleteTask = async (idTask, stage) => {


        try {

            confirmAlert({
                title: 'Confirmar exclusão',
                message: 'Deseja realmente confirmar a exclusão?',
                buttons: [
                    {
                        label: 'Sim',
                        onClick: async () => {

                            let ckeckLogin = localStorage.getItem('token');


                            const data = await api.post('/task_delete', {
                                idTask
                            }, {
                                headers: {
                                    'Authorization': `Bearer ${ckeckLogin}`
                                }
                            })

                            let itemTask = dataTasks[stage].filter(item => {
                                return item.id !== idTask
                            })

                            setDataTasks({
                                ...dataTasks,
                                [stage]: itemTask
                            })

                            toast.success('Registro excluído com sucesso!', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });

                        }
                    },
                    {
                        label: 'Não',
                        onClick: () => {
                            return false
                        }
                    }
                ]
            });


        } catch (error) {

            toast.error('Erro na exclusão!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        }





    }

    const onDragEnd = async result => {

        const { source, destination, draggableId } = result;


        if (!destination) {
            return;
        }

        let ckeckLogin = localStorage.getItem('token');

        if (source.droppableId === destination.droppableId) {



            let getList = dataTasks[source.droppableId];


            const items = reorder(
                getList,
                source.index,
                destination.index
            );

            setDataTasks({
                ...dataTasks,
                [source.droppableId]: items
            })


            const { data } = await api.post('/task_reorder_stage', {
                stage: source.droppableId,
                index: destination.index,
                id: draggableId
            }, {
                headers: {
                    'Authorization': `Bearer ${ckeckLogin}`
                }
            })

            console.log(data)

        } else {

            let getListSource = dataTasks[source.droppableId];
            let getListDestination = dataTasks[destination.droppableId];

            const result = move(
                getListSource,
                getListDestination,
                source,
                destination
            );


            setDataTasks({
                ...dataTasks,
                [source.droppableId]: result[source.droppableId],
                [destination.droppableId]: result[destination.droppableId]
            });


            const { data } = await api.post('/task_move_stage', {
                stage: destination.droppableId,
                index: destination.index,
                id: draggableId
            }, {
                headers: {
                    'Authorization': `Bearer ${ckeckLogin}`
                }
            })

        }

    };

    const onChangeFieldsAddTask = ({ target }) => {
        setFieldsTasks({
            ...fieldsTasks,
            [target.name]: target.value
        })
    }

    const onChangeFieldsAlterTask = ({ target }) => {
        setFieldsTasksAlter({
            ...fieldsTasksAlter,
            [target.name]: target.value
        })
    }


    const openModalAlter = () => {
        setIsOpenModalAlter(true);
    }


    const closeModalAlter = () => {
        setIsOpenModalAlter(false);
    }

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                {
                    Object.keys(dataTasks).map(item => (
                        <Droppable droppableId={item} key={item}>
                            {(provided, snapshot) => {

                                let itensStage = stages.find(k => k.status === item)

                                return <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)} className={itensStage.color}>
                                    <div className="card p-2">
                                        <h6><i className={itensStage.icon}></i>  {itensStage.name}
                                            {
                                                itensStage.create && (

                                                    <Link to="#" className="float-right" data-toggle="modal" data-target="#addTaskModal">
                                                        Novo
                                                        </Link>
                                                )
                                            }
                                        </h6>
                                    </div>
                                    {dataTasks[item].filter(item_2 => item_2.stage === item)
                                        .map((item_2, index) => (
                                            <Draggable
                                                key={item_2.id}
                                                draggableId={item_2.id}
                                                index={index}
                                                indexBD={item_2.index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                        <div className="card card-tarefa">
                                                            <div className="card-body">
                                                                <h5 className="card-title"><b>{item_2.title}</b></h5>
                                                                <p className="card-text"> {item_2.description}</p>
                                                                <Link to="#" className="card-link"
                                                                    onClick={() => {
                                                                        showTask(item_2.id)
                                                                    }}>Editar</Link>
                                                                <Link to="#" className="card-link pr-2"
                                                                    onClick={() => {
                                                                        deleteTask(item_2.id, item)
                                                                    }}>Excluir</Link>
                                                                {moment(item_2.created_at).format('D/M/YYYY')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>)

                                        )
                                    }
                                    {provided.placeholder}
                                </div>
                            }}
                        </Droppable>

                    ))
                }
            </DragDropContext>

            <div className="modal fade" id="addTaskModal" tabIndex={-1} aria-labelledby="addTaskModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addTaskModalLabel">Nova tarefa</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={createTask} id="form_add_task">
                                <div className="form-group">
                                    <label htmlFor="title" className="col-form-label">Título da tarefa:</label>
                                    <input type="text" className="form-control" id="title" name="title" value={fieldsTasks.title} onChange={onChangeFieldsAddTask} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="requester_name" className="col-form-label">Nome do solicitante:</label>
                                    <input type="text" className="form-control" id="requester_name" name="requester_name" value={fieldsTasks.requester_name} onChange={onChangeFieldsAddTask} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="requester_email" className="col-form-label">E-mail do solicitante:</label>
                                    <input type="email" className="form-control" id="requester_email" name="requester_email" value={fieldsTasks.requester_email} onChange={onChangeFieldsAddTask} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description" className="col-form-label">Descrição:</label>
                                    <textarea className="form-control" id="description" name="description" value={fieldsTasks.description} onChange={onChangeFieldsAddTask} defaultValue={""} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="comment" className="col-form-label">Comentário:</label>
                                    <textarea className="form-control" id="comment" name="comment" value={fieldsTasks.comment} onChange={onChangeFieldsAddTask} defaultValue={""} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="due_date" className="col-form-label">Prazo:</label>
                                    <input type="datetime-local" className="form-control" id="due_date" name="due_date" min="1900-01-01T00:00" max="2099-12-31T00:00" value={fieldsTasks.due_date} onChange={onChangeFieldsAddTask} required />
                                </div>
                                <button type="button" className="btn btn-sm btn-secondary" data-dismiss="modal">Fechar</button>
                                <button type="submit" className="btn btn-sm btn-success float-right">Salvar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            <Modal
                isOpen={openIsModalAlter}
                onRequestClose={closeModalAlter}
                style={customStyles}
            >

                <h2>Editar tarefa</h2>
                <form onSubmit={updateTask} id="form_update_task">
                    <input type="hidden" name="alter_id" id="alter_id" value={fieldsTasksAlter.alter_id} onChange={onChangeFieldsAlterTask} />
                    <div className="form-group">
                        <label htmlFor="alter_title" className="col-form-label">Título da tarefa:</label>
                        <input type="text" className="form-control" id="alter_title" name="alter_title" value={fieldsTasksAlter.alter_title} onChange={onChangeFieldsAlterTask} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="alter_requester_name" className="col-form-label">Nome do solicitante:</label>
                        <input type="text" className="form-control" id="alter_requester_name" name="alter_requester_name" value={fieldsTasksAlter.alter_requester_name} onChange={onChangeFieldsAlterTask} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="alter_requester_email" className="col-form-label">E-mail do solicitante:</label>
                        <input type="email" className="form-control" id="alter_requester_email" name="alter_requester_email" value={fieldsTasksAlter.alter_requester_email} onChange={onChangeFieldsAlterTask} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="alter_description" className="col-form-label">Descrição:</label>
                        <textarea className="form-control" id="alter_description" name="alter_description" value={fieldsTasksAlter.alter_description} onChange={onChangeFieldsAlterTask} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="alter_comment" className="col-form-label">Comentário:</label>
                        <textarea className="form-control" id="alter_comment" name="alter_comment" value={fieldsTasksAlter.alter_comment} onChange={onChangeFieldsAlterTask} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="alter_due_date" className="col-form-label">Prazo:</label>
                        <input type="datetime-local" className="form-control" id="alter_due_date" name="alter_due_date" min="1900-01-01T00:00" max="2099-12-31T00:00" value={fieldsTasksAlter.alter_due_date} onChange={onChangeFieldsAlterTask} required />
                    </div>
                    <button type="button" className="btn btn-sm btn-secondary" onClick={closeModalAlter}>Fechar</button>
                    <button type="submit" className="btn btn-sm btn-success float-right">Salvar</button>
                </form>

            </Modal>

        </>

    )

}

export default QuoteApp;
