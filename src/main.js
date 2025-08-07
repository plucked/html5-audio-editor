import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import $ from "jquery";

import { ACInitFFT } from "./ACFFT";
import { initializeAudioLayerControls } from "./audioLayerControl";

window.$ = $;
window.jQuery = $;

function onDocumentLoaded() {
  console.log("Loaded");

  ACInitFFT();

  initializeAudioLayerControls();

  var audioLayerControl = document.querySelector("#audioLayerControl");
  audioLayerControl.removeAllSequenceEditors();
  var leftEditor = audioLayerControl.createSequenceEditor("Left Channel");
  var rightEditor = audioLayerControl.createSequenceEditor("Right Channel");

  audioLayerControl.setLinkMode(true);
}

$(document).ready(function () {
  onDocumentLoaded();

  var supportLabel = $("#browser_support")[0];

  if (typeof (window.AudioContext || window.webkitAudioContext) === "undefined") {
    supportLabel.className = "badge bg-danger";
    supportLabel.innerHTML =
      "no web audio API support. try the latest Google Chrome build.";
  } else {
    supportLabel.className = "badge bg-success";
    supportLabel.innerHTML = "you have web audio API support.";
  }

  $("#welcomeAsModal").modal("show");

  //--
  $("#copy-btn").on("click", () => {
    $("#audioLayerControl")[0].copy();
  });
  $("#paste-btn").on("click", () => {
    $("#audioLayerControl")[0].paste();
  });
  $("#cut-btn").on("click", () => {
    $("#audioLayerControl")[0].cut();
  });
  $("#crop-btn").on("click", () => {
    $("#audioLayerControl")[0].crop();
  });
  $("#delete-btn").on("click", () => {
    $("#audioLayerControl")[0].del();
  });
  //--
  $("#select-all-btn").on("click", () => {
    $("#audioLayerControl")[0].selectAll();
  });
  $("#zoom-to-selection-btn").on("click", () => {
    $("#audioLayerControl")[0].zoomIntoSelection();
  });
  $("#zoom-to-fit-btn").on("click", () => {
    $("#audioLayerControl")[0].zoomToFit();
  });
  //--
  $("#btn_play").on("click", () => {
    $("#audioLayerControl")[0].play();
  });
  $("#btn_pause").on("click", () => {
    $("#audioLayerControl")[0].pause();
  });
  $("#btn_stop").on("click", () => {
    $("#audioLayerControl")[0].stop();
  });
  $("#btn_loop").on("click", () => {
    $("#audioLayerControl")[0].toggleLoop();
  });
  //--
  $("#render-btn").on("click", () => {
    $("#audioLayerControl")[0].save($("#savelink")[0]);
  });
  //--
  $("#decrease-db-btn").on("click", () => {
    decrease_db();
  });
  $("#increase-db-btn").on("click", () => {
    increase_db();
  });
  $("#gain-db").on("click", () => {
    gain_btn_clicked();
  });
  //--
  $("#normalize-btn").on("click", () => {
    $("#audioLayerControl")[0].filterNormalize();
  });
  $("#silence-btn").on("click", () => {
    $("#audioLayerControl")[0].filterSilence();
  });
  $("#fade-in-btn").on("click", () => {
    $("#audioLayerControl")[0].filterFadeIn();
  });
  $("#fade-out-btn").on("click", () => {
    $("#audioLayerControl")[0].filterFadeOut();
  });

  var db_gain = 0;

  function decrease_db() {
    --db_gain;
    update_db_gain_btn();
  }

  function increase_db() {
    ++db_gain;
    update_db_gain_btn();
  }

  function update_db_gain_btn() {
    var gain_btn = $("#gain-db")[0];

    gain_btn.innerHTML = db_gain + " db";

    if (db_gain === 0) {
      gain_btn.className = "btn disabled";
    } else {
      gain_btn.className = "btn btn-primary";
    }
  }

  function gain_btn_clicked() {
    $("#audioLayerControl")[0].filterGain(db_gain);
    db_gain = 0;
    update_db_gain_btn();
  }
});
