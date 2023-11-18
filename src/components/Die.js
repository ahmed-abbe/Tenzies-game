const Die = ({ value: n, isHeld: h, handleClick }) => {
    let pipArray = [];
    for (let i = 0; i < n; i++) {
        pipArray.push(<span key={i} className="pip"></span>);
    }
    return (
        <div
            className={`die-${n}`}
            style={h ? { backgroundColor: "#59E391" } : {}}
            onClick={handleClick}
        >
            {pipArray}
        </div>
    );
};

export default Die;
