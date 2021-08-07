/***********************************************************************
 * TTV Clip Confirm - Adds a confirmation prompt when clipping Twitch streams/VODs to help reduce accidental clips.
 * Copyright (C) 2021  Argo Wizbang
 *
 * This file is a part of TTV Clip Confirm.
 *
 * TTV Clip Confirm is free software: you can redistribute
 * it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version
 * 3 of the License, or (at your option) any later version.
 *
 * TTV Clip Confirm is distributed in the hope that it
 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with TTV Clip Confirm. If not, see
 * <https://www.gnu.org/licenses/>.
 *
 * Support: https://github.com/argowizbang/ttv-clip-confirm/
 * Contact: argowizbang@gmail.com
 **********************************************************************/
( function() {
    'use strict';

    let rootObserver, clipButton, clipConfirmationModal,
        root             = document.getElementById( 'root' ),
        clipConfirmed    = false;

    const overridePressed     = e => {
              if ( ( e.ctrlKey || e.metaKey ) && e.shiftKey ) {
                  return true;
              }
          },
          confirmClip         = () => {
              clipConfirmed = true;
              clipButton.click();

              clipConfirmed = false;
              return;
          },
          hideConfirmModal    = ( e ) => {
            if ( e.target === clipConfirmationModal || e.target.classList.contains( 'ttvcc-modal-button' ) ) {
                document.body.classList.remove( 'ttvcc-modal-active' );
            }
          },
          openConfirmModal    = e => {
            /*
               * Canceled events can't be manually triggered so we use variable "clipConfirmed"
               * to determine if we have or have not already confirmed the Clip action and then
               * reset it to false after the entire process runs
               */
              /** @todo Rework hotkey detection into just this function and figure out why it's not working */
              if ( ! clipConfirmed ) {
                  if ( overridePressed( e ) ) {
                      return;
                  }

                  e.stopImmediatePropagation();

                  let channelName   = document.getElementsByClassName( 'channel-info-content' )[0].getElementsByTagName( 'h1' )[0].textContent.trim();

                  document.getElementById( 'ttvcc-modal-content').innerHTML = 'Create a new <b>' + channelName + '</b> clip?';

                  document.body.classList.add( 'ttvcc-modal-active' );
                }
          },
          addClipConfirmation = ( mutations, observer ) => {
              mutations.forEach( mutation => {
                  if ( mutation.type === 'childList' && document.querySelector( '[data-a-target="player-clip-button"]' ) ) {
                      let closeModalSVG = {};

                      clipConfirmationModal = document.getElementById( 'ttvcc-clip-confirm-modal' );

                      if ( ! document.body.contains( clipConfirmationModal ) ) {
                          // Generate and inject confirmation modal
                          clipConfirmationModal = {
                              modal:     {
                                  overlay: document.createElement( 'div' ),
                                  container: document.createElement( 'div' )
                              },
                              title:     document.createElement( 'h2' ),
                              content:   document.createElement( 'p' ),
                              buttons: {
                                  container: document.createElement( 'div' ),
                                  cancel:    document.createElement( 'button' ),
                                  close:     document.createElement( 'button' ),
                                  confirm:   document.createElement( 'button' )
                              }
                          }

                          // Overall Modal Container/Background Overlay
                          clipConfirmationModal.modal.overlay.id           = 'ttvcc-clip-confirm-modal';
                          clipConfirmationModal.modal.overlay.className    = 'ttvcc-clip-confirm-modal';
                          clipConfirmationModal.modal.overlay.setAttribute( 'role', 'dialog' );
                          clipConfirmationModal.modal.overlay.setAttribute( 'aria-modal', 'true' );
                          clipConfirmationModal.modal.overlay.addEventListener( 'click', hideConfirmModal );

                          // Actual Modal Window
                          clipConfirmationModal.modal.container.id        = 'ttvcc-clip-confirm-modal-inner';
                          clipConfirmationModal.modal.container.className = 'ttvcc-clip-confirm-modal-inner tw-modal';

                          // Modal window heading
                          clipConfirmationModal.title.id          = 'ttvcc-modal-title';
                          clipConfirmationModal.title.className   = 'ttvcc-modal-title';
                          clipConfirmationModal.title.textContent = 'Confirm Clip Creation'
                        
                          // Modal window body text
                          clipConfirmationModal.content.id        = 'ttvcc-modal-content';
                          clipConfirmationModal.content.className = 'ttvcc-modal-content';

                          // Container for Cancel, Confirm, and X (Close) buttons
                          clipConfirmationModal.buttons.container.id        = 'ttvcc-modal-buttons';
                          clipConfirmationModal.buttons.container.className = 'ttvcc-modal-buttons';

                          // Cancel button
                          clipConfirmationModal.buttons.cancel.id           = 'ttvcc-modal-cancel-button';
                          clipConfirmationModal.buttons.cancel.className    = 'ttvcc-modal-cancel-button ttvcc-modal-button';
                          clipConfirmationModal.buttons.cancel.textContent  = 'No, cancel';
                          
                          // Confirm button
                          clipConfirmationModal.buttons.confirm.id          = 'ttvcc-modal-confirm-button';
                          clipConfirmationModal.buttons.confirm.className   = 'ttvcc-modal-confirm-button ttvcc-modal-button';
                          clipConfirmationModal.buttons.confirm.textContent = 'Yes, create clip';
                          clipConfirmationModal.buttons.confirm.addEventListener( 'click', confirmClip );
                          
                          // X (Close) button
                          clipConfirmationModal.buttons.close.id          = 'ttvcc-modal-close-button';
                          clipConfirmationModal.buttons.close.className   = 'ttvcc-modal-close-button ttvcc-modal-button modal__close-button modal__close-button--inset';
                          clipConfirmationModal.buttons.close.setAttribute( 'aria-label', 'Close modal' );
                          
                          // SVG for X (Close) icon
                          closeModalSVG.svg  = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
                          closeModalSVG.g    = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
                          closeModalSVG.path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

                          closeModalSVG.svg.setAttribute( 'class', 'sc-fzqNJr hXQgjp' );
                          closeModalSVG.svg.setAttribute( 'width', '100%' );
                          closeModalSVG.svg.setAttribute( 'height', '100%' );
                          closeModalSVG.svg.setAttribute( 'version', '1.1' );
                          closeModalSVG.svg.setAttribute( 'viewBox', '0 0 20 20' );
                          closeModalSVG.svg.setAttribute( 'x', '0px' );
                          closeModalSVG.svg.setAttribute( 'y', '0px' );

                          closeModalSVG.path.setAttribute(
                              'd',
                              'M8.5 10L4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z'
                          );
                          
                          closeModalSVG.g.appendChild( closeModalSVG.path );
                          closeModalSVG.svg.appendChild( closeModalSVG.g );

                          // Construct modal from all of these newly created components and inject into the page
                          clipConfirmationModal.buttons.close.appendChild( closeModalSVG.svg );

                          clipConfirmationModal.modal.container.appendChild( clipConfirmationModal.title );
                          clipConfirmationModal.modal.container.appendChild( clipConfirmationModal.content );

                          clipConfirmationModal.buttons.container.appendChild( clipConfirmationModal.buttons.cancel );
                          clipConfirmationModal.buttons.container.appendChild( clipConfirmationModal.buttons.confirm );
                          clipConfirmationModal.buttons.container.appendChild( clipConfirmationModal.buttons.close );
                          clipConfirmationModal.modal.container.appendChild( clipConfirmationModal.buttons.container );

                          clipConfirmationModal.modal.overlay.appendChild( clipConfirmationModal.modal.container );
                          document.body.appendChild( clipConfirmationModal.modal.overlay );
                      }

                      // Okay, time to force the confirmation when initiating the clipping process!
                      clipButton = document.querySelector( '[data-a-target="player-clip-button"]' );

                      if ( clipButton && clipButton.dataset.requireConfirm !== 'true' ) {
                          clipButton.dataset.requireConfirm = 'true';

                          let overrideKeyName = browser.runtime.PlatformOs === 'mac' ? '⌘' : 'Ctrl',
                              clipButtonTooltip = clipButton.nextElementSibling;

                          clipButton.setAttribute( 'aria-label', clipButton.getAttribute( 'aria-label' ) + ' | Hold ' + overrideKeyName + ' + Shift keys to skip confirmation' );
                          clipButtonTooltip.textContent = clipButton.getAttribute( 'aria-label' );

                          clipButton.addEventListener( 'click', openConfirmModal );
                          document.documentElement.addEventListener( 'keydown', e => {
                              /** @todo: Add option to set custom override hotkey instead of Shift */
                              if ( e.altKey && e.key.toLowerCase() === 'x' ) {
                                  e.stopImmediatePropagation();

                                  if ( overridePressed( e ) ) {
                                      confirmClip();
                                  } else {
                                      openConfirmModal( e );
                                  }
                              }
                          } );
                      }
                  }
              } );
          };

    rootObserver = new MutationObserver( addClipConfirmation );
    rootObserver.observe( root, { childList: true, subtree: true } );

    // Move modal into video player so that it can be displayed in fullscreen video mode
    document.addEventListener( 'fullscreenchange', () => {
        let modalDestination = document.body;

        if ( document.fullscreenElement ) {
            modalDestination = document.fullscreenElement;
        }

        modalDestination.appendChild( clipConfirmationModal );
    } );
} )();
