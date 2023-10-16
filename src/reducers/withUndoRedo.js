export const withUndoRedo = (reducer) => {
    let past = [];
    
    return (state, action) => {
        if (state === undefined) {
            return {
                canUndo: false,
                canRedo: false,
                ... reducer(state, action)
            };
        }
        
        switch(action.type) {
            case 'UNDO':
                const lastEntry = past[past.length - 1];
                past = past.slice(0, -1);
                return {
                    ...lastEntry,
                    canRedo: true 
                }
            default:
                const newPresent = reducer(state, action);
                if(newPresent.nextInstructionId != state.nextInstructionId) {
                    past = [...past, state];
                    return {
                        ...newPresent,
                        canUndo: true
                    }
                }
                return state;        
        }
    }
}