import RefreshIndicator from 'material-ui/RefreshIndicator';

const style = {
  container: {
    position: 'absolute',
    right:"2rem",
    bottom:"2rem"
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
};

const LoadingIndicator = (props) => (
  <div style={style.container}>
    <RefreshIndicator
      size={40}
      left={10}
      top={0}
      status={props.hasLoaded ? "hide": "loading"}
      style={style.refresh}
    />
  </div>
);

export default LoadingIndicator;