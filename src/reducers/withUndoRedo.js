export const withUndoRedo = (reducer) => {
    return (state, action) => {
        if (state === undefined)
            return {
                canUndo: false,
                canRedo: false,
                ... reducer(state, action)
            };
        const newPresent = reducer(state, action);
        if(newPresent.nextInstructionId != state.nextInstructionId) {
            return {
                ...newPresent,
                canUndo: true
            }
        }
        return state;
    }
}