/**
 * Copyright © 2017 Jairo Honorio. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types'
import emptyFunction from 'fbjs/lib/emptyFunction';
// eslint-disable-next-line no-unused-vars
import s from './App.scss';
import TomatoComponent from '../TomatoComponent/Tomato';
import {
    Layout,
    Header,
    Content,
    Grid,
    Cell,
    DataTable,
    TableHeader,
    Textfield,
} from 'react-mdl';
import { AppDrawer } from '../AppDrawerComponent/AppDrawer';


class App extends Component {

    static propTypes = {
        context: PropTypes.shape({
            onSetTitle: PropTypes.func,
            onSetMeta: PropTypes.func,
            onPageNotFound: PropTypes.func,
        }),
        error: PropTypes.object,
    };

    static childContextTypes = {
        onSetTitle: PropTypes.func.isRequired,
        onSetMeta: PropTypes.func.isRequired,
        onPageNotFound: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            openDialog: false,
            tickSoundConfig: '2',
            tasks: JSON.parse(window.localStorage.getItem("tasks")) || [],
            newTaskName: '',
        };
    }

    componentDidMount() {
        // Every 5 seconds update the time counter of every task
        this.interval = setInterval(() => this.forceUpdate(), 5000);
    }

    componentWillUnmount() {
        // Avoid possible future memory/error leaks
        clearInterval(this.interval);
    }

    getChildContext() {
        const context = this.context;
        return {
            onSetTitle: context.onSetTitle || emptyFunction,
            onSetMeta: context.onSetMeta || emptyFunction,
            onPageNotFound: context.onPageNotFound || emptyFunction,
        };
    }

    onTickSoundConfigChange = (e) => {
        this.setState({ tickSoundConfig: e.target.value });
    };

    onGetConfig = () => ({
        tickSoundConfig: this.state.tickSoundConfig,
    });

    handleToggleDialog = () => {
        this.setState({ openDialog: !this.state.openDialog });
    };

    handleCloseDialog = () => {
        this.setState({ openDialog: false });
    };

    onTimerStarted = () => {
        if (this.state.newTaskName === "") {
            this.setState({ newTaskName: "Task" });
        }
    };

    onTimerFinished = (mode) => {
        var newTaskName = this.state.newTaskName;

        switch (mode) {
            case 1:
                newTaskName = "(short break)";
                break;

            case 2:
                newTaskName = "(long break)";
                break;

            default:
        }

        var newTaskList = [{
            taskName: newTaskName,
            time: Date.now()
        }, ...this.state.tasks];

        this.setState({
            tasks: newTaskList
        });

        window.localStorage.setItem('tasks', JSON.stringify(newTaskList));
    };

    // this.state.tasks [
    //     { taskName: 'Acrylic (Transsf sf af asf asf asf a fas fa dasd asd asd asfa', time: 25 },
    //     { taskName: 'Plywood (Birch)', time: 50 },
    //     { taskName: 'Laminate (Gold on Blue)', time: 10 }
    // ]

    render() {
        const shareUrl = 'http://zen.jahdsoft.com/';

        return !this.props.error ? (
            <div>
                <Layout fixedDrawer>
                    <Header transparent />
                    <AppDrawer handleToggleDialog={this.handleToggleDialog}
                        openDialog={this.state.openDialog}
                        tickSoundConfig={this.state.tickSoundConfig}
                        onTickSoundConfigChange={this.onTickSoundConfigChange} shareUrl={shareUrl}>
                    </AppDrawer>
                    <Content>
                        <Grid>
                            <Cell col={7} tablet={12} phone={12}>
                                <TomatoComponent getConfig={this.onGetConfig}
                                    onTimerStarted={this.onTimerStarted}
                                    onTimerFinished={this.onTimerFinished} />
                            </Cell>

                            <Cell col={5} tablet={12} phone={12}>
                                <DataTable className="taskTable"
                                    rows={this.state.tasks}
                                >

                                    <TableHeader name="taskName">
                                        <Textfield
                                            className="newTaskNameTextfield"
                                            onChange={(e) => {
                                                this.setState({
                                                    newTaskName: e.target.value
                                                })
                                            }}
                                            value={this.state.newTaskName}
                                            label="New task name"
                                            floatingLabel
                                        />
                                    </TableHeader>
                                    <TableHeader cellFormatter={(date) => {
                                        var seconds = Math.floor((new Date() - date) / 1000);

                                        var interval = Math.floor(seconds / 31536000);

                                        if (interval > 1) {
                                            return interval + "y";
                                        }
                                        interval = Math.floor(seconds / 2592000);
                                        if (interval > 1) {
                                            return interval + "mo";
                                        }
                                        interval = Math.floor(seconds / 86400);
                                        if (interval > 1) {
                                            return interval + "d";
                                        }
                                        interval = Math.floor(seconds / 3600);
                                        if (interval > 1) {
                                            return interval + "h";
                                        }
                                        interval = Math.floor(seconds / 60);
                                        if (interval > 1) {
                                            return interval + "m";
                                        }
                                        return "<1m";
                                    }} name="time">Ago</TableHeader>

                                </DataTable>

                            </Cell>
                        </Grid>
                    </Content>
                </Layout>
            </div>
        ) : <div>ERROR</div>;
    }

}

export default App;
