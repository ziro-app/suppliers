import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Icon from '../Icon2';
import { createFactory } from '../componentState';

import { ModalProps } from './types';
import { overlay, container, closeButton, overlayAnimation, containerAnimation } from './styles';

// const _Modal = (globalState?: { useState: () => [{ userInput: boolean }, (arg: any) => void] }) => {
const _Modal = (globalState?: any) => {
  const Modal = ({ showModal, setShowModal, showCloseButton = false, closeButtonColor = '#222', children, styleContainer }: ModalProps) => {
    if (globalState) {
      const { useState: gState } = globalState;
      var [globalIsOpen, setGlobalIsOpen] = gState();
    }

    const isOpen = globalState ? !!globalIsOpen.userInput : showModal;

    return (
      <AnimatePresence exitBeforeEnter>
        {isOpen && (
          <motion.div key="overlay" style={overlay} {...overlayAnimation}>
            <motion.div key="container" style={{ ...container, ...styleContainer }} {...containerAnimation}>
              {showCloseButton && (
                <motion.div style={closeButton} onClick={globalState ? () => setGlobalIsOpen({ userInput: false }) : setShowModal && (() => setShowModal(false))} whileTap={{ scale: 0.95 }}>
                  <Icon featherName="XCircle" stroke={closeButtonColor} />
                </motion.div>
              )}
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return Modal;
};

const ModalFactory = createFactory(_Modal);
const Modal = _Modal();
export { Modal, ModalFactory };
