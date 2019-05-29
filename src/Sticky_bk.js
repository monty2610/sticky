import React from 'react';
import PropTypes from 'prop-types';

class Sticky extends React.PureComponent {
  static propTypes = {
    offset: PropTypes.number
  };

  static defaultProps = {
    offset: 0,
  };


  constructor(props){
    super(props);
    this.state = {
      position: 'static',
      top: 0,
      bottom: 0
    }
    this.top = 0;
  }

  componentDidMount(){
    this.currentState = 'initial';
    this.$sticky = document.querySelector('#sticky');
    this.$document = document.documentElement;
    this.updateDimensions();
    window.addEventListener('scroll', this.scrollHandler);
    window.addEventListener('resize', this.resizeHandler);
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
  }

  resizeHandler = () => {
    this.updateDimensions();
    this.scrollHandler();
  }

  scrollHandler = () => {
    const { offset } = this.props;
    const delta = this.$document.scrollTop - this.documentScrollTop;
    this.documentScrollTop = this.$document.scrollTop;
    const topInViewport = this.topBoundary > this.documentScrollTop;
    const bottomInViewport = (this.bottomBoundary - this.documentScrollTop) < window.innerHeight;

    if(topInViewport && bottomInViewport) {
      console.log('top and bottom both in viewport');
      this.setState({
        position: 'relative',
        top: 0,
      });
    } else if (!topInViewport && !this.isGreaterThanViewport) {
      console.log('top not in viewport and height is less than viewport');
      this.setState({
        position: 'fixed',
        top: offset,
        width: this.width,
      });
    } else if (bottomInViewport && this.isGreaterThanViewport && delta > 0) {
      console.log('bottom in viewport and height is greater than viewport');
      this.status = 'fixed';
      this.setState({
        position: 'fixed',
        top: 'initial',
        bottom: 0,
        width: this.width,
      });
    } else if (!bottomInViewport && this.isGreaterThanViewport) {
      console.log('bottom not in viewport and height is greater than viewport');
      this.setState({
        position: 'relative',
        top: 0,
      });
    }

    if(delta < 0) {
      if(this.status === 'fixed'){
        console.log('scrolling up and status is still fixed');
        this.top = this.documentScrollTop + window.innerHeight - this.height;
        this.setState({
          position: 'relative',
          top: this.top
        });
        this.status = 'released';
      } else if (this.status === 'released' && this.top > this.documentScrollTop && !topInViewport) {
        this.status = 'fixed';
        this.setState({
          position: 'fixed',
          top: offset
        })
      } else if (topInViewport && this.status === 'fixed'){
        this.status = 'initial';
        this.setState({
          position: 'relative',
          top: 0
        })
      }
    }
  }


  render(){
    const { children } = this.props;

    return <div id="sticky" style={this.state}>{children}</div>
  }
}

export default Sticky;
