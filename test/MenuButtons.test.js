import React from "react";
import {
  initializeReactContainer,
  renderWithStore,
  store,
  dispatchToStore,
  buttonWithLabel,
  click,
} from "./reactTestExtensions";
import { expectRedux } from "expect-redux";
import { MenuButtons } from "../src/MenuButtons";

describe("MenuButtons", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  describe("reset button", () => {
    it("renders", () => {
      renderWithStore(<MenuButtons />);
      expect(buttonWithLabel("Reset")).not.toBeNull();
    });

    it("is disabled initially", () => {
      renderWithStore(<MenuButtons />);
      expect(
        buttonWithLabel("Reset").hasAttribute(
          "disabled"
        )
      ).toBeTruthy();
    });

    it("is enabled once a state change occurs", () => {
      renderWithStore(<MenuButtons />);
      dispatchToStore({
        type: "SUBMIT_EDIT_LINE",
        text: "forward 10\n",
      });
      expect(
        buttonWithLabel("Reset").hasAttribute(
          "disabled"
        )
      ).toBeFalsy();
    });

    it("dispatches an action of RESET when clicked", () => {
      renderWithStore(<MenuButtons />);
      dispatchToStore({
        type: "SUBMIT_EDIT_LINE",
        text: "forward 10\n",
      });
      click(buttonWithLabel("Reset"));
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: "RESET" });
    });
  });

  describe('undo button', () => {
    it('renders', () => {
      renderWithStore(<MenuButtons />);
      expect(buttonWithLabel("Undo")).not.toBeUndefined();
    });

    it('is disabled if there is no history', () => {
      renderWithStore(<MenuButtons />)
      expect(
        buttonWithLabel('Undo').hasAttribute('disabled')
      ).toBeTruthy();
    });

    it('is enabled if an action occurs', () => {
      renderWithStore(<MenuButtons />);
      dispatchToStore({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      expect(
        buttonWithLabel('Undo').hasAttribute('disabled')
      ).toBeFalsy();
    });

    it('dispatches an action of UNDO when clicked', () => {
      renderWithStore(<MenuButtons />)
      dispatchToStore({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      click(buttonWithLabel('Undo'));
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'UNDO'});
    });
  });

  describe('redo button', () => {
    it('renders', () => {
      renderWithStore(<MenuButtons />);
      expect(buttonWithLabel("Redo")).not.toBeUndefined();
    });

    it('is disabled if undo has not occurred yet', () => {
      renderWithStore(<MenuButtons />);
      dispatchToStore({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      expect(
        buttonWithLabel('Redo').hasAttribute('disabled')
      ).toBeTruthy();
    });

    it('is enabled if an undo occurred', () => {
      renderWithStore(<MenuButtons />);
      dispatchToStore({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      dispatchToStore({ type: 'UNDO' })
      expect(
        buttonWithLabel('Redo').hasAttribute('disabled')
      ).toBeFalsy();
    });

    it('dispatches an action of REDO when clicked', () => {
      renderWithStore(<MenuButtons />);
      dispatchToStore({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      click(buttonWithLabel('Undo'));
      click(buttonWithLabel('Redo'));
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'REDO' })
    });
  })
});
