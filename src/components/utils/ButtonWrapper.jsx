const ButtonWrapper= ({
                                                         children,
                                                         bottom = '80px',
                                                         style = {}
                                                     }) => {
    const wrapperStyle = {
        position: 'fixed',
        bottom: bottom,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1001,
        left: 0,
        right: 0,
        ...style
    };

    return (
        <div style={wrapperStyle}>
            {children}
        </div>
    );
};

export default ButtonWrapper;