import './loader.css';

const Loader = ({ isPlaying = true }) => {
    return (
        <div className="loader-container">
            <div className={`loader ${isPlaying ? 'playing' : ''}`}></div>
        </div>
    );
};

export default Loader;
