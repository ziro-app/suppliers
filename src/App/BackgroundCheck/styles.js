export const wrapper = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridAutoRows: '100px',
    boxSizing: 'border-box'
},
    box1 = {
        gridColumnStart: 1,
        gridColumnEnd: 4,
        gridRowStart: 1,
        gridRowEnd: 3
    },
    box2 = {
        gridColumnStart: 1,
        gridColumnEnd: 4,
        gridRowStart: 2,
        gridRowEnd: 2,
        marginTop: '35px',
        height: '900px'
    }
