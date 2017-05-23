/**
 * AccessibleBlockly
 *
 * Copyright 2017 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Component representing the variable rename modal.
 *
 * @author corydiers@google.com (Cory Diers)
 */

goog.provide('blocklyApp.VariableAddModalComponent');

goog.require('blocklyApp.AudioService');
goog.require('blocklyApp.KeyboardInputService');
goog.require('blocklyApp.TranslatePipe');
goog.require('blocklyApp.VariableModalService');

goog.require('Blockly.CommonModal');

blocklyApp.VariableAddModalComponent = ng.core.Component({
  selector: 'blockly-add-variable-modal',
  template: `
    <div *ngIf="modalIsVisible"class="blocklyModalCurtain"
         (click)="dismissModal()">
      <!-- $event.stopPropagation() prevents the modal from closing when its
      interior is clicked. -->
      <div id="varModal" class="blocklyModal" role="alertdialog"
           (click)="$event.stopPropagation()" tabindex="0"
           aria-labelledby="variableModalHeading">
          <form id="varForm">
            <p id="inputLabel">New Variable Name:
              <input id="mainFieldId" type="text" [ngModel]="VALUE"
                     (ngModelChange)="setTextValue($event)" tabindex="0"
                     aria-labelledby="inputLabel" />
            </p>
            <hr>
            <button id="submitButton" (click)="submit()">
              SUBMIT
            </button>
            <button id="cancelButton" (click)="dismissModal()">
              CANCEL
            </button>
          </form>
      </div>
    </div>
  `,
  pipes: [blocklyApp.TranslatePipe]
})
.Class({
  constructor: [
    blocklyApp.AudioService, blocklyApp.KeyboardInputService, blocklyApp.VariableModalService,
    function(audioService, keyboardService, variableService) {
      this.workspace = blocklyApp.workspace;
      this.variableModalService = variableService;
      this.audioService = audioService;
      this.keyboardInputService = keyboardService
      this.modalIsVisible = false;
      this.activeButtonIndex = -1;

      var that = this;
      this.variableModalService.registerPreAddShowHook(
        function() {
          that.modalIsVisible = true;

          Blockly.CommonModal.setupKeyboardOverrides(that);

          setTimeout(function() {
            document.getElementById('mainFieldId').focus();
          }, 150);
        }
      );
    }
  ],
  // Caches the current text variable as the user types.
  setTextValue: function(newValue) {
    this.variableName = newValue;
  },
  // Closes the modal (on both success and failure).
  hideModal_: Blockly.CommonModal.hideModal,
  // Focuses on the button represented by the given index.
  focusOnOption: Blockly.CommonModal.focusOnOption,
  // Counts the number of interactive elements for the modal.
  numInteractiveElements: Blockly.CommonModal.numInteractiveElements,
  // Gets all the interactive elements for the modal.
  getInteractiveElements: Blockly.CommonModal.getInteractiveElements,
  // Gets the container with interactive elements.
  getInteractiveContainer: function() {
    return document.getElementById("varForm");
  },
  // Submits the name change for the variable.
  submit: function() {
    this.workspace.createVariable(this.variableName);
    this.hideModal_();
  },
  // Dismisses and closes the modal.
  dismissModal: function() {
    this.hideModal_();
  }
})
