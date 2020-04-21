import React from 'react';
import { Grid, Cell, Navigation, Icon, Drawer, Button, RadioGroup, Radio } from 'react-mdl';
import { version } from '../../package.json';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, TelegramShareButton, WhatsappShareButton, PinterestShareButton, RedditShareButton, EmailShareButton, FacebookIcon, TwitterIcon, TelegramIcon, WhatsappIcon, LinkedinIcon, PinterestIcon, RedditIcon, EmailIcon } from 'react-share';
// eslint-disable-next-line no-unused-vars
import s from './AppDrawer.scss';

export class AppDrawer extends React.Component {
    render() {
        return (<Drawer className="drawer">
            <Grid shadow={1} style={{
                margin: '0'
            }}>
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
                    <Button ripple onClick={this.props.handleToggleDialog}>
                        <Icon name="settings" />
                    </Button>
                </Cell>
                {this.props.openDialog ? <Cell col={12}>
                    <Grid shadow={1} style={{
                        margin: '20px 0'
                    }}>
                        <Cell col={6}>
                            Tick sound
                                        </Cell>
                        <Cell col={6}>
                            <RadioGroup name="tickSoundConfig" value={this.props.tickSoundConfig} childContainer="div" onChange={this.props.onTickSoundConfigChange}>
                                <Radio value="2" ripple>
                                    Starting
                                                </Radio>
                                <Radio value="1" ripple>
                                    On
                                                </Radio>
                                <Radio value="0" ripple>
                                    Off
                                                </Radio>
                            </RadioGroup>
                        </Cell>
                    </Grid>
                </Cell> : null}
            </Grid>

            <Navigation>
                <a href="https://github.com/jahd2602/zen-pomodoro" target="blank">
                    <Icon name="code" /> Code on Github
                            </a>
                <a href="https://pe.linkedin.com/in/jairohonorio" target="blank">
                    <Icon name="portrait" /> My LinkedIn
                            </a>
                <a href="mailto:jairo@jahdsoft.com" target="blank">
                    <Icon name="email" /> Email me
                            </a>
            </Navigation>

            <Grid shadow={1} className="socialContainer">
                <Cell col={12}>
                    <h5>Share via:</h5>
                </Cell>
                <Cell col={6}>
                    <FacebookShareButton url={this.props.shareUrl}>
                        <FacebookIcon round />
                    </FacebookShareButton>
                </Cell>

                <Cell col={6}>
                    <TwitterShareButton url={this.props.shareUrl}>
                        <TwitterIcon round />
                    </TwitterShareButton>
                </Cell>

                <Cell col={6}>
                    <LinkedinShareButton url={this.props.shareUrl}>
                        <LinkedinIcon round />
                    </LinkedinShareButton>
                </Cell>

                <Cell col={6}>
                    <WhatsappShareButton url={this.props.shareUrl}>
                        <WhatsappIcon round />
                    </WhatsappShareButton>
                </Cell>

                <Cell col={6}>
                    <TelegramShareButton url={this.props.shareUrl}>
                        <TelegramIcon round />
                    </TelegramShareButton>
                </Cell>

                <Cell col={6}>
                    <RedditShareButton url={this.props.shareUrl}>
                        <RedditIcon round />
                    </RedditShareButton>
                </Cell>

                <Cell col={6}>
                    <PinterestShareButton url={this.props.shareUrl} media="http://zen.jahdsoft.com/images/screenshot.png">
                        <PinterestIcon round />
                    </PinterestShareButton>
                </Cell>

                <Cell col={6}>
                    <EmailShareButton url={this.props.shareUrl}>
                        <EmailIcon round />
                    </EmailShareButton>
                </Cell>
            </Grid>
        </Drawer>);
    }
}
