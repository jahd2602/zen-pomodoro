/**
 * Copyright © 2017 Jairo Honorio. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types'
import emptyFunction from 'fbjs/lib/emptyFunction';
import s from './App.scss';
import TomatoComponent from '../TomatoComponent/Tomato';
import {
    Layout,
    Header,
    Content,
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
        };
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

    render() {
        const shareUrl = 'http://zen.jahdsoft.com/';

        return !this.props.error ? (
            <div>
                <Layout fixedDrawer>
                    <Header transparent />
                    <AppDrawer handleToggleDialog={this.handleToggleDialog} openDialog={this.state.openDialog} tickSoundConfig={this.state.tickSoundConfig} onTickSoundConfigChange={this.onTickSoundConfigChange} shareUrl={shareUrl}></AppDrawer>
                    <Content>
                        <TomatoComponent getConfig={this.onGetConfig} />
                    </Content>
                </Layout>
            </div>
        ) : <div>ERROR</div>;
    }

}

export default App;
