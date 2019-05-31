import React from 'react';
import PropTypes from 'prop-types';

class Sticky extends React.PureComponent {
  static propTypes = {
    offset: PropTypes.number,
    children: PropTypes.any,
  };

  static defaultProps = {
    offset: 0,
  };

  constructor(props) {
    super(props);
    this.stickyNode = React.createRef();
    this.state = {
      position: 'static',
    };
    this.status = 'static';
  }

  componentDidMount() {
    this.$sticky = this.stickyNode.current;
    this.$document = document.documentElement;

    this.updateDimensions = this.updateDimensions.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);

    window.addEventListener('scroll', this.scrollHandler);
    window.addEventListener('resize', this.resizeHandler);

    this.setInitialState();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
  }

  /**
   * This will set the initial state of the sticky
   */
  setInitialState = () => {
    if (this.status !== 'static') {
      this.status = 'static';
      this.setState(
        {
          position: 'static',
        },
        () => {
          this.updateDimensions();
        }
      );
    } else {
      this.updateDimensions();
    }
  };

  /**
   * This will update the dimensions of the sticky in case of viewport resizing
   */
  updateDimensions = () => {
    const { offset } = this.props;
    this.dimensions = this.$sticky.getBoundingClientRect();
    this.topBoundary = this.dimensions.top + window.scrollY - offset; // original top boundary of the sticky node
    this.bottomBoundary = this.dimensions.bottom + window.scrollY; // original bottom boundary of the sticky node
    this.width = this.$sticky.offsetWidth;
    this.height = this.$sticky.offsetHeight;
    this.isGreaterThanViewport = this.$sticky.offsetHeight > window.innerHeight; // if sticky is greater than viewport height, in this case sticky wont stick to the top on scrolling down
    this.documentScrollTop = this.$document.scrollTop;
    this.updateInitialPosition();
  };

  /**
   * This will update the initial position of the  sticky
   */
  updateInitialPosition() {
    this.documentScrollTop = this.$document.scrollTop; // current scroll position
    const topInViewport = this.topBoundary > this.documentScrollTop; // if original top boundary of Sticky is in viewport
    const bottomInViewport =
      this.bottomBoundary - this.documentScrollTop < window.innerHeight;

    if (!topInViewport && bottomInViewport && !this.isGreaterThanViewport) {
      this.topFixed();
    } else if (
      !topInViewport &&
      bottomInViewport &&
      this.isGreaterThanViewport
    ) {
      this.bottomFixed();
    } else {
      this.reset();
    }
  }

  resizeHandler = () => {
    this.setInitialState();
  };

  reset = () => {
    this.setState({
      position: 'static',
    });
    this.status = 'static';
  };

  topFixed = () => {
    const { offset } = this.props;
    this.setState({
      position: 'fixed',
      top: offset,
      width: this.width,
    });
    this.status = 'topFixed';
  };

  bottomFixed = () => {
    this.setState({
      position: 'fixed',
      bottom: 0,
      top: 'initial',
      width: this.width,
    });
    this.status = 'bottomFixed';
  };

  released = (to = 'top') => {
    this.setState(
      {
        position: 'relative',
        top: 0,
        width: this.width,
      },
      () => {
        let releasedTop;
        if (to === 'bottom') {
          const currentBottomBoundary =
            this.$document.scrollTop + window.innerHeight;
          releasedTop =
            currentBottomBoundary - this.height - this.$sticky.offsetTop;
        } else {
          releasedTop = this.$document.scrollTop - this.$sticky.offsetTop;
        }

        this.setState({
          top: `${releasedTop}px`,
        });
        this.status = 'released';
      }
    );
  };

  /* eslint-disable */
  scrollHandler = () => {
    const { offset } = this.props;
    const delta = this.$document.scrollTop - this.documentScrollTop; // if user is scrolling up or down

    this.documentScrollTop = this.$document.scrollTop; // current scroll position
    const topInViewport = this.topBoundary > this.documentScrollTop; // if original top boundary of Sticky is in viewport
    const bottomInViewport =
      this.bottomBoundary - this.documentScrollTop < window.innerHeight; // if original bottom boundary of Sticky is in viewport

    // sticky can be in four positions
    // "released" : if sticky node is fixed either at top or bottom then on scrolling in opposite direction, to keep things smooth, we add position relative
    // "topFixed" : sticky node is sticked to the top edge of the browser window
    // "bottomFixed" : sticky node is sticked to the bottom edge of the browser window
    // "static" : sticky node is at its original position
    switch (this.status) {
      case "released":
        if (delta > 0) {
          // if position is released and on scrolling down, make node bottom sticky when bottom boundary reach below the viewport
          if (
            this.$sticky.offsetTop + this.height <
            this.documentScrollTop + window.innerHeight
          ) {
            this.bottomFixed();
          }
        } else if (this.$sticky.offsetTop - offset > this.documentScrollTop) {
          // if position is released and on scrolling up, make node top sticky when top boundary reach above the viewport
          this.topFixed();
        }
        break;
      case "topFixed":
        if (delta > 0 && this.isGreaterThanViewport) {
          // if height is greater than window viewport then set it as released
          this.released();
        } else if (topInViewport) {
          // if top is in viewport then reset its position
          this.reset();
        }
        break;
      case "bottomFixed":
        if (delta < 0) {
          // if fixed on the bottom then on scrolligng up make it released
          this.released("bottom");
        }
        break;
      case "static":
        if (delta > 0) {
          if (!topInViewport && !this.isGreaterThanViewport) {
            this.topFixed();
          } else if (bottomInViewport && this.isGreaterThanViewport) {
            this.bottomFixed();
          }
        } else if (bottomInViewport && this.isGreaterThanViewport) {
          this.bottomFixed();
        }
        break;
      default:
    }
  };

  render() {
    const { children } = this.props;

    return (
      <div ref={this.stickyNode} style={this.state}>
        {children}
      </div>
    );
  }
}

export default Sticky;
