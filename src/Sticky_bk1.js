import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

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
    this.state = {
      position: 'static',
      top: 0,
      bottom: 0,
    };
    this.status = 'static';
  }

  componentDidMount() {
    this.currentState = 'initial';
    this.$sticky = document.querySelector('#sticky');
    this.$document = document.documentElement;
    this.releasedTop = 0;

    this.updateDimensions = this.updateDimensions.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);

    this.onScroll = debounce(this.scrollHandler, 10);
    this.onResize = debounce(this.resizeHandler, 10);
    this.updateDimensions();
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
  }

  updateDimensions = () => {
    const { offset } = this.props;
    this.dimensions = this.$sticky.getBoundingClientRect();
    this.topBoundary = this.dimensions.top + window.scrollY - offset;
    this.bottomBoundary = this.dimensions.bottom + window.scrollY;
    this.width = this.$sticky.offsetWidth;
    this.height = this.$sticky.offsetHeight;
    this.isGreaterThanViewport = this.$sticky.offsetHeight > window.innerHeight;
    this.documentScrollTop = this.$document.scrollTop;
  };

  resizeHandler = () => {
    this.updateDimensions();
    this.scrollHandler();
  };

  scrollHandler = () => {
    const { offset } = this.props;
    const delta = this.$document.scrollTop - this.documentScrollTop;

    this.documentScrollTop = this.$document.scrollTop;
    const topInViewport = this.topBoundary > this.documentScrollTop;
    const bottomInViewport =
      this.bottomBoundary - this.documentScrollTop < window.innerHeight;

    if(delta > 0) {
      if(this.status === 'released' && (this.$sticky.offsetTop + this.height) < (this.documentScrollTop + window.innerHeight)) {
        this.setState({
          position: 'fixed',
          top: 'initial',
          bottom: 0,
          width: this.width
        });
        this.status = "bottomFixed";
      } else if (topInViewport && bottomInViewport) {
        this.setState({
          position: 'static',
        });
      } else if (!topInViewport && !this.isGreaterThanViewport) {
        this.status = 'fixed';
        this.setState({
          position: 'fixed',
          top: offset,
          width: this.width,
        });
      } else if (bottomInViewport && this.isGreaterThanViewport && this.status === 'static') {
        this.status = 'bottomFixed';
        this.setState({
          position: 'fixed',
          top: 'initial',
          bottom: 0,
          width: this.width,
        });
      } else if (!bottomInViewport && this.isGreaterThanViewport) {
        this.status = 'static';
        this.setState({
          position: 'static',
        });
      }
    } else {
      if(topInViewport) {
        this.setState({
          position: 'static'
        });
        this.status = 'static';
      }else if(this.status === 'bottomFixed') { //element sticks to bottom
        this.setState({
          position: 'relative',
          top: 0
        }, () => {
          const currentBottomBoundary = this.$document.scrollTop + window.innerHeight;
          this.releasedTop = currentBottomBoundary - this.height - this.$sticky.offsetTop;
          this.$sticky.style.top = `${this.releasedTop}px`;
          this.status = 'released';
        });
      }else if(this.status === 'released' && (this.$sticky.offsetTop - offset > this.documentScrollTop)) {
        this.setState({
          position: 'fixed',
          top: offset,
        });
        this.status = 'fixed';
      }
    }
  };

  render() {
    const { children } = this.props;

    return (
      <div id="sticky" style={this.state}>
        {children}
      </div>
    );
  }
}

export default Sticky;
