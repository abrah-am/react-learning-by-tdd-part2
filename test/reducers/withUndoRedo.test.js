import {
    withUndoRedo
} from '../../src/reducers/withUndoRedo';

describe('withUndoRedo', () => {
    let decoratedReducerSpy;
    let reducer;

    beforeEach(() => {
        decoratedReducerSpy = jest.fn();
        reducer = withUndoRedo(decoratedReducerSpy);
    });

    describe('when initializing state', () => {
        it('calls the decorated reducer with undefined state and an action', () => {
            const action = { type: 'UNKNOWN' };
            reducer(undefined, action);
            expect(decoratedReducerSpy).toBeCalledWith(
                undefined,
                action
            );
        });

        it('returns a value of what the inner reducer returns', () => {
            decoratedReducerSpy.mockReturnValue({ a: 123 });
            expect(reducer(undefined)).toMatchObject(
                { a: 123 }
            );
        });

        it('cannot undo', () => {
            expect(reducer(undefined)).toMatchObject(
                { canUndo: false }
            );
        });

        it('cannot redo', () => {
            expect(reducer(undefined)).toMatchObject(
                { canRedo: false }
            );
        });
    });

    describe('performing an action', () => {
        const innerAction = { type: 'INNER' };
        const present = { a: 123, nextInstructionId: 0 };
        const future = { b: 234, nextInstructionId: 1 };

        beforeEach(() => {
            decoratedReducerSpy.mockReturnValue(future);
        });

        it('can undo after a new present has been provided', () => {
            const result = reducer(
                { canUndo: false, present },
                innerAction
            );
            expect(result.canUndo).toBeTruthy();
        });

        it('forwards action to the inner reducer', () => {
            reducer(present, innerAction);
            expect(decoratedReducerSpy).toBeCalledWith(
                present,
                innerAction
            );
        });

        it('returns the result of the inner reducer', () => {
            const result = reducer(present, innerAction);
            expect(result).toMatchObject(future);
        });

        it('returns the previous state if nextInstructionId does not increment', () => {
            decoratedReducerSpy.mockReturnValue(
                { nextInstructionId: 0 }
            );
            const result = reducer(present, innerAction);
            expect(result).toBe(present)
        });

    });
});