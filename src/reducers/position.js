const positionReducer = (state = { lat: 0, lng: 0, country: '' }, action) => {
    switch(action.type) {
        case 'SET_POSITION':
            return {
                lat: action.position.lat,
                lng: action.position.lng,
                country: action.position.country
            }
        default:
            return state
    }
};

export default positionReducer;