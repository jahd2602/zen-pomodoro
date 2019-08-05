import React, { Component } from 'react';
import PropTypes from 'prop-types'
import s from './Tomato.scss';
import { Howl } from 'howler';
import { FABButton, Icon, Button, Grid, Cell, Chip, Card, CardActions, CardTitle } from 'react-mdl';

const title = 'Zen Pomodoro';

class TomatoComponent extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    getConfig: PropTypes.func.isRequired,
  };

  static MODE_POMODORO = 0; // 25 minutes
  static MODE_SHORT_BREAK = 1; // 5 minutes
  static MODE_LONG_BREAK = 2; // 15 minutes
  static MODE_CUSTOM = 3; // User selected

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  componentDidMount() {
    this.loadSounds();
    this.doTick();
  }

  onPlayPauseClick = () => {
    if (this.timePos === 0) {
      this.ringSound.stop();
      this.onStopClick();
    }
    this.paused = !this.paused;
    this.forceUpdate();
  };

  onStopClick = () => {
    this.jumpToMode();
    this.paused = true;
    this.ringSound.stop();
    this.forceUpdate();
  };

  onMouseUp = () => {
    this.isDragging = false;
  };

  onMouseDown = (event) => {
    event.preventDefault();

    if (event.touches) { // Only for touch interfaces
      const posX = event.touches[0].pageX;
      this.oldPosX = posX;
      this.lastTurnPos = posX;
    }

    this.isDragging = true;
  };

  onMouseMove = (event) => {
    event.preventDefault();

    // Detects wether the event comes from a mouse or a touch
    const posX = !event.touches ? event.pageX : event.touches[0].pageX;

    if (this.isDragging) {
      // Moves the timeline according to the user's drag motion
      const moveX = posX - this.oldPosX;
      this.pixelPos -= moveX;
      this.pixelPos = Math.max(0, Math.min(this.pixelPos, this.pixelWidth));
      this.timePos = Math.ceil(this.pixelPos * this.minutesWidth / this.pixelWidth *
          this.timeMultiplier);
      this.forceUpdate();

      // Plays de turn sound when appropiate
      if (moveX > 0) {
        this.lastTurnPos = posX;
      }
      if (posX - this.lastTurnPos < -this.turnSoundDist) {
        if (this.pixelPos < this.pixelWidth) {
          this.turnSound.play();
        }
        this.lastTurnPos = posX;
      }
    } else {
      this.lastTurnPos = posX;
    }
    this.oldPosX = posX;
  };

  isDragging = false;
  oldPosX = 0;
  pixelWidth = 630;
  minutesWidth = 25;
  timeMultiplier = 1000 * 60;
  pixelPos = this.pixelWidth;
  timePos = this.minutesWidth * this.timeMultiplier;
  isTickPlaying = false;
  turnSoundDist = 25 / 2;
  lastTurnPos = 0;
  lastTick = Date.now();
  paused = true;
  mode = TomatoComponent.MODE_POMODORO;
  showWhatIsPomodoroChip = true;
  showWDontLockDeviceChip = true;
  showWDontLockDeviceCard = false;

  tickSound;
  turnSound;
  ringSound;

  loadSounds() {
    this.tickSound = new Howl({
      src: ['sounds/pomodoro_tick.ogg', 'sounds/pomodoro_tick.mp3'],
      loop: true,
      volume: 0.5,
    });

    this.turnSound = new Howl({
      src: ['sounds/pomodoro_turn.ogg', 'sounds/pomodoro_turn.mp3'],
    });
    this.ringSound = new Howl({
      src: ['sounds/pomodoro_ring.ogg', 'sounds/pomodoro_ring.mp3'],
      volume: 1.0,
    });
  }

  doTick = () => {
    setTimeout(this.doTick, 10); // the timer will continue running even if in the background

    // Check time elapsed since last tick
    const tickDuration = Date.now() - this.lastTick;
    this.lastTick = Date.now();

    // Check when the clock is not supposed to run
    if (this.isDragging || this.timePos <= 0 || this.paused) {
      if (this.isTickPlaying) {
        this.tickSound.stop();
        this.isTickPlaying = false;
      }
      return;
    } // else the clock is runnin

    if (!this.isTickPlaying) {
      // Start playing the tick sound
      if (this.tickSound && this.props.getConfig().tickSoundConfig !== '0') {
        this.tickSound.volume(0.5);
        this.tickSound.play();
      }
      this.isTickPlaying = true;
    } else if (this.tickSound.volume() > 0 && this.props.getConfig().tickSoundConfig === '2') {
      this.tickSound.volume(this.tickSound.volume() - 0.002); // Decreases tick volume over a few
                                                              // seconds
    }

    // Reduce the remaining time in the clock down to 0
    if (!this.paused) {
      this.timePos -= tickDuration;
    }
    this.timePos = Math.max(0, Math.min(this.timePos, this.minutesWidth * this.timeMultiplier));

    // Adjust the timeline position
    this.pixelPos = this.timePos / this.minutesWidth * this.pixelWidth / this.timeMultiplier;
    this.forceUpdate();

    // Ring when the time reaches zero
    if (this.timePos === 0) {
      this.ringSound.stop().play();
      this.paused = true;
      this.forceUpdate();
    }
  };

  jumpToMode = () => {
    const setPos = (multiplier) => {
      this.pixelPos = this.pixelWidth * multiplier;
      this.timePos = this.minutesWidth * this.timeMultiplier * multiplier;
    };
    if (this.mode === TomatoComponent.MODE_SHORT_BREAK) { // 5 minutes
      setPos(0.2);
    } else if (this.mode === TomatoComponent.MODE_LONG_BREAK) { // 15 minutes
      setPos(0.6);
    } else { // 25 minutes, full clock
      setPos(1);
      this.mode = TomatoComponent.MODE_POMODORO;
    }
  };

  selectMode = (mode) => {
    this.mode = mode;
    this.onStopClick();
  };

  hideHelpChip = () => {
    this.showWhatIsPomodoroChip = false;
    this.forceUpdate();
  };

  hideDontLockDeviceChip = () => {
    this.showWDontLockDeviceChip = false;
    this.forceUpdate();
  };

  showDontLockDeviceCard = () => {
    this.showWDontLockDeviceChip = false;
    this.showWDontLockDeviceCard = true;
    this.forceUpdate();
  };

  hideDontLockDeviceCard = () => {
    this.showWDontLockDeviceCard = false;
    this.forceUpdate();
  };

  sendMail = () => {
    window.open('mailto:jairo@jahdsoft.com');
  };

  render() {
    return (
        <Grid className="root">
          { this.showWhatIsPomodoroChip ?
              <Cell col={12} className="mdl-typography--text-center">
                <Chip className="mdl-color--white" onClose={this.hideHelpChip}>
                  <a href="https://en.wikipedia.org/wiki/Pomodoro_Technique" target="_blank"
                     className="mdl-color-text--black"
                  >
                    What is the Pomodoro Technique?
                  </a>
                </Chip>
              </Cell> : null }

          { this.showWDontLockDeviceChip ?
              <Cell col={12} className="mdl-typography--text-center">
                <Chip className="mdl-color--white" onClose={this.hideDontLockDeviceChip}>
                  <a href="#"
                     onClick={this.showDontLockDeviceCard}
                     className="mdl-color-text--black"
                  >
                    Don't lock your device. Why?
                  </a>
                </Chip>
              </Cell> : null }

          { this.showWDontLockDeviceCard ?
              <Cell
                  col={12}
              >
                <Card
                    shadow={1}
                    style={{ margin: 'auto' }}
                >
                  <CardTitle expand>
                    <h4 style={{ marginTop: '0' }}>
                      Modern mobile operating systems will stop background JavaScript code while locked.
                      Thus, if locked, the timer will stop running. Please don't lock your device. This
                      issue does not occur in native builds. A native build for Android and, maybe, iOS,
                      may be released soon, if users, like you, are interested.
                    </h4>
                  </CardTitle>
                  <CardActions border>
                    <Button
                        colored
                        onClick={this.hideDontLockDeviceCard}
                    >
                      OK
                    </Button>
                    <Button
                        colored
                        onClick={this.sendMail}
                    >Email me</Button>
                  </CardActions>
                </Card>
              </Cell>
              : null }

          <Cell
              col={12}
              className="main"
              onMouseMove={this.onMouseMove}
              onMouseUp={this.onMouseUp}
              onTouchMove={this.onMouseMove}
              onTouchEnd={this.onMouseUp}
              ref="main"
          >
            <svg style={{ display: 'none' }}>
              <defs>
                <path
                    id="stempath"
                    d="M45.263 56.325c-4.153 2.877-8.688 3.997-13.684 2.947-6.75-1.42-12.658-.133-17.343
                5.274-.444.513-1.154.795-1.945.841 8.279-12.713 19.369-20.347
                35.181-19.185-1.142-4.912-2.697-9.386-8.229-10.989 8.393-2.329 14.908.648 20.39
                6.482 4.967-3.077 7.65-6.526 12.7-16.222 2.45 6.292 1.399 11.899-3.969 20.682 3.378
                1.556 6.882 2.05 10.168.448 3.099-1.51 5.857-3.72 9.176-5.891-1.793 6.643-5.919
                10.74-11.471 13.709-5.747 3.074-11.571 1.879-16.764.42l-9.355
                19.685c-4.165-4.978-4.672-11.17-4.276-17.6l.219-.991-.798.39z"
                />
              </defs>
            </svg>
            <svg
                className="stem"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
            >
              <use xlinkHref="#stempath" />
            </svg>
            <div className="tomato"
                 ref="tomato"
                 onMouseDown={this.onMouseDown}
                 onTouchStart={this.onMouseDown}
            >
              <div
                  className="timeline"
                  ref="timeline"
                  style={{ transform: `translateX(-${this.pixelPos}px)` }}
              />
            </div>
          </Cell>

          <Cell col={12}>
            <div className="controls">
              <FABButton
                  ripple
                  className="mdl-color--white"
                  onClick={this.onStopClick}
              >
                <Icon name="stop" />
              </FABButton>
              <FABButton
                  ripple
                  className="mdl-color--white"
                  style={{ float: 'right' }}
                  onClick={this.onPlayPauseClick}
              >
                <Icon name={this.paused ? 'play_arrow' : 'pause'} />
              </FABButton>
            </div>
          </Cell>

          <Cell
              col={12}
              className="mdl-typography--text-center"
          >
            <Button
                className={this.mode === TomatoComponent.MODE_POMODORO ? 'mdl-color-text--white' : null}
                onClick={() => this.selectMode(TomatoComponent.MODE_POMODORO)}
                ripple
            >
              Pomodoro
            </Button>
            <Button
                className={this.mode === TomatoComponent.MODE_SHORT_BREAK ? 'mdl-color-text--white' : null}
                onClick={() => this.selectMode(TomatoComponent.MODE_SHORT_BREAK)}
                ripple
            >
              Short Break
            </Button>
            <Button
                className={this.mode === TomatoComponent.MODE_LONG_BREAK ? 'mdl-color-text--white' : null}
                onClick={() => this.selectMode(TomatoComponent.MODE_LONG_BREAK)}
                ripple
            >
              Long Break
            </Button>
          </Cell>
        </Grid>
    );
  }

}

export default TomatoComponent;
