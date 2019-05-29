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
    this.status = 'static';
    this.setState({
      position: 'static',
      width: this.width,
    })
  };

  resizeHandler = () => {
    this.updateDimensions();
    this.scrollHandler();
  };

  reset = () => {
    this.setState({
      position: 'static',
    });
    this.status = 'static';
  }

  topFixed = () => {
    const { offset } = this.props;
    this.setState({
      position: 'fixed',
      top: offset,
    });
    this.status = 'topFixed';
  }

  bottomFixed = () => {
    this.setState({
      position: 'fixed',
      bottom: 0,
      top: 'initial'
    });
    this.status = 'bottomFixed';
  }

  released = (to = 'top') => {
    this.setState({
      position: 'relative',
      top: 0
    }, () => {
      let releasedTop;
      if(to === 'bottom') {
        const currentBottomBoundary = this.$document.scrollTop + window.innerHeight;
        releasedTop = currentBottomBoundary - this.height - this.$sticky.offsetTop;
      } else {
        releasedTop = this.$document.scrollTop - this.$sticky.offsetTop;
      }

      this.setState({
        top: `${releasedTop}px`
      });
      this.status = 'released';
    });
  }

  scrollHandler = () => {
    const { offset } = this.props;
    const delta = this.$document.scrollTop - this.documentScrollTop;

    this.documentScrollTop = this.$document.scrollTop;
    const topInViewport = this.topBoundary + offset > this.documentScrollTop;
    const bottomInViewport =
      this.bottomBoundary - this.documentScrollTop < window.innerHeight;

    switch (this.status) {
      case 'released':
        if(delta > 0) {
          if(this.$sticky.offsetTop + this.height < this.documentScrollTop + window.innerHeight) {
            this.bottomFixed();
          }
        } else {
          if(this.$sticky.offsetTop - offset > this.documentScrollTop){
            this.topFixed();
          }
        }
        break;
      case 'topFixed':
        if(delta > 0 && this.isGreaterThanViewport) {
          this.released();
        } else {
          if(topInViewport) {
            this.reset();
          }
        }
        break;
        case 'bottomFixed':
          if(delta < 0) {
            this.released('bottom');
          }
          break;
          case 'static':
            if(delta > 0) {
              if(!topInViewport && !this.isGreaterThanViewport){
                this.topFixed();
              } else if (bottomInViewport && this.isGreaterThanViewport) {
                this.bottomFixed();
              } else {
                this.reset();
              }
            } else {
              if(bottomInViewport && this.isGreaterThanViewport) {
                this.bottomFixed();
              }
            }
            break;
          default:;
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
