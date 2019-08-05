/**
 * Copyright © 2017 Jairo Honorio. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types'
import emptyFunction from 'fbjs/lib/emptyFunction';
import s from './App.scss';
import TomatoComponent from '../TomatoComponent/Tomato';
import {
    Grid,
    Cell,
    Layout,
    Navigation,
    Header,
    Content,
    Icon,
    Drawer,
    Button,
    RadioGroup,
    Radio,
} from 'react-mdl';
import {version} from './../../package.json';
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    PinterestShareButton,
    RedditShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    TelegramIcon,
    WhatsappIcon,
    LinkedinIcon,
    PinterestIcon,
    RedditIcon,
    EmailIcon
} from 'react-share';

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
        this.setState({tickSoundConfig: e.target.value});
    };

    onGetConfig = () => ({
        tickSoundConfig: this.state.tickSoundConfig,
    });

    handleToggleDialog = () => {
        this.setState({openDialog: !this.state.openDialog});
    };

    handleCloseDialog = () => {
        this.setState({openDialog: false});
    };

    render() {
        const shareUrl = 'http://zen.jahdsoft.com/';

        return !this.props.error ? (
            <div>
                <Layout fixedDrawer>
                    <Header transparent/>
                    <Drawer className="drawer">
                        <Grid
                            shadow={1}
                            style={{margin: '0'}}
                        >
                            <Cell col={12}>
                                <h1>Zen Pomodoro</h1>
                            </Cell>
                            <Cell col={8}>
                                <div>
                                    by Jairo Honorio
                                </div>
                                <div className="mdl-color-text--grey">
                                    version {version}
                                </div>
                            </Cell>
                            <Cell col={4}>
                                <Button
                                    ripple
                                    onClick={this.handleToggleDialog}
                                >
                                    <Icon name="settings"/>
                                </Button>
                            </Cell>
                            {this.state.openDialog ?
                                <Cell col={12}>
                                    <Grid
                                        shadow={1}
                                        style={{margin: '0'}}
                                    >
                                        <Cell col={6}>
                                            Tick sound
                                        </Cell>
                                        <Cell col={6}>
                                            <RadioGroup
                                                name="tickSoundConfig"
                                                value={this.state.tickSoundConfig}
                                                childContainer="div"
                                                onChange={this.onTickSoundConfigChange}
                                            >
                                                <Radio
                                                    value="2"
                                                    ripple
                                                >
                                                    Starting
                                                </Radio>
                                                <Radio
                                                    value="1"
                                                    ripple
                                                >
                                                    On
                                                </Radio>
                                                <Radio
                                                    value="0"
                                                    ripple
                                                >
                                                    Off
                                                </Radio>
                                            </RadioGroup>
                                        </Cell>
                                    </Grid>
                                </Cell>
                                : null}
                        </Grid>

                        <Navigation>
                            <a
                                href="https://github.com/jahd2602/zen-pomodoro"
                                target="blank"
                            >
                                <Icon name="code"/> Code on Github
                            </a>
                            <a
                                href="https://pe.linkedin.com/in/jairohonorio"
                                target="blank"
                            >
                                <Icon name="portrait"/> My LinkedIn
                            </a>
                            <a
                                href="mailto:jairo@jahdsoft.com"
                                target="blank"
                            >
                                <Icon name="email"/> Email me
                            </a>
                        </Navigation>

                        <Grid
                            shadow={1}
                            className="socialContainer"
                        >
                            <h2>Social Share</h2>
                            <Cell col={6}>
                                <FacebookShareButton url={shareUrl}>
                                    <FacebookIcon round/>
                                </FacebookShareButton>
                            </Cell>

                            <Cell col={6}>
                                <TwitterShareButton url={shareUrl}>
                                    <TwitterIcon round/>
                                </TwitterShareButton>
                            </Cell>

                            <Cell col={6}>
                                <LinkedinShareButton url={shareUrl}>
                                    <LinkedinIcon round/>
                                </LinkedinShareButton>
                            </Cell>

                            <Cell col={6}>
                                <WhatsappShareButton url={shareUrl}>
                                    <WhatsappIcon round/>
                                </WhatsappShareButton>
                            </Cell>

                            <Cell col={6}>
                                <TelegramShareButton url={shareUrl}>
                                    <TelegramIcon round/>
                                </TelegramShareButton>
                            </Cell>

                            <Cell col={6}>
                                <RedditShareButton url={shareUrl}>
                                    <RedditIcon round/>
                                </RedditShareButton>
                            </Cell>

                            <Cell col={6}>
                                <PinterestShareButton
                                    url={shareUrl}
                                    media="http://zen.jahdsoft.com/images/screenshot.png"
                                >
                                    <PinterestIcon round/>
                                </PinterestShareButton>
                            </Cell>

                            <Cell col={6}>
                                <EmailShareButton url={shareUrl}>
                                    <EmailIcon round/>
                                </EmailShareButton>
                            </Cell>
                        </Grid>
                    </Drawer>
                    <Content>
                        <TomatoComponent getConfig={this.onGetConfig}/>
                    </Content>
                </Layout>
            </div>
        ) : <div>ERROR</div>;
    }

}

export default App;
