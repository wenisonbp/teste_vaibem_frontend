import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { stages } from '@src/data';
import { Link } from 'react-router-dom';
import api from '@src/services/api';



// fake data generator
// const getItems = (count, offset = 0) =>
//     Array.from({ length: count }, (v, k) => k).map(k => ({
//         id: `item-${k + offset}`,
//         content: `item ${k + offset}`
//     }));

// a little function to help us with reordering the result
const reorder = (getList, startIndex, endIndex) => {

    const result = Array.from(getList);

    const [removed] = result.splice(startIndex, 1);

    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
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

class QuoteApp extends Component {


    state = {};

    componentDidMount() {

        stages.forEach(item => {
            this.setState({
                ...this.state,
                [item.status]: []
            })
        })

        this.loadTasks();

    }

    loadTasks = async () => {

        try {

            let ckeckLogin = localStorage.getItem('token');

            api.get("/task", {
                headers: {
                    'Authorization': `Bearer ${ckeckLogin}`
                }
            }).then(response => {

                response.data.forEach(element => {

                    let itemState = Object.assign(this.state[element.stage]);

                    itemState.push(element);

                    this.setState({
                        [element.stage]: itemState
                    })
                });


            });


        } catch (error) {

            localStorage.removeItem('token');
            window.location.reload();

        }

    }


    onDragEnd = result => {

        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {

            let getList = this.state[source.droppableId];

            const items = reorder(
                getList,
                source.index,
                destination.index
            );

            this.setState({
                ...this.state,
                [source.droppableId]: items
            })



        } else {

            let getListSource = this.state[source.droppableId];
            let getListDestination = this.state[destination.droppableId];

            const result = move(
                getListSource,
                getListDestination,
                source,
                destination
            );


            this.setState({
                ...this.state,
                [source.droppableId]: result[source.droppableId],
                [destination.droppableId]: result[destination.droppableId]
            });



        }

    };

    render() {

        return (
            <>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    {
                        Object.keys(this.state).map(item => (
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
                                        {this.state[item].filter(item_2 => item_2.stage === item)
                                            .map((item_2, index) => (
                                                <Draggable
                                                    key={item_2.id}
                                                    draggableId={item_2.id}
                                                    index={index}>
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
                                <form method="post">
                                    <div className="form-group">
                                        <label htmlFor="title" className="col-form-label">Título da tarefa:</label>
                                        <input type="text" className="form-control" id="title" name="title" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="requester_name" className="col-form-label">Nome do solicitante:</label>
                                        <input type="text" className="form-control" id="requester_name" name="requester_name" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="requester_email" className="col-form-label">E-mail do solicitante:</label>
                                        <input type="email" className="form-control" id="requester_email" name="requester_email" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description" className="col-form-label">Descrição:</label>
                                        <textarea className="form-control" id="description" defaultValue={""} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Comentário:</label>
                                        <textarea className="form-control" id="message-text" defaultValue={""} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="due_date" className="col-form-label">Prazo:</label>
                                        <input type="text" className="form-control" id="due_date" name="due_date" />
                                    </div>
                                    <button type="button" className="btn btn-sm btn-secondary" data-dismiss="modal">Fechar</button>
                                    <button type="submit" className="btn btn-sm btn-success float-right">Salvar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </>

        )

    }
}

export default QuoteApp;
