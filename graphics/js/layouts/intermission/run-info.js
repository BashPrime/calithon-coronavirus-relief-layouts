// Main run info update functionality.
'use strict';

// The bundle name where all the run information is pulled from.
const speedcontrolBundle = 'nodecg-speedcontrol';
const donationBundle = 'speedcontrol-gdqtracker';

const rotateInterval = 15000;
let rotateState = 0;

// Initialize the page.
$(() => {
    // Run data.
    let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
    let runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);
    let bids = nodecg.Replicant('bids', donationBundle);

    // Get the next X runs in the schedule.
    function getNextRuns(runData, amount) {
        let nextRuns = [];
        let indexOfCurrentRun = findIndexInRunDataArray(runData);
        for (let i = 1; i <= amount; i++) {
            if (!runDataArray.value[indexOfCurrentRun + i]) {
                break;
            }
            nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
        }
        return nextRuns;
    }

    // Find array index of current run based on it's ID.
    function findIndexInRunDataArray(run) {
        let indexOfRun = -1;

        // Completely skips this if the run variable isn't defined.
        if (run) {
            for (let i = 0; i < runDataArray.value.length; i++) {
                if (run.id === runDataArray.value[i].id) {
                    indexOfRun = i; break;
                }
            }
        }

        return indexOfRun;
    }

    if (isOffline) {
        loadOffline();
    }
    else {
        loadFromSpeedControl();
    }

    function loadOffline() {
        let upNextGame = $('#up-next-game');
        let upNextInfo = $('#up-next-info');

        upNextGame.html('Army of Two: The 40th Day');
        upNextInfo.html('All Items - Mr_Shasta');
        runFitText('#up-next-game', upNextGameWidth);
	    runFitText('#up-next-info', upNextInfoWidth);

        let onDeckGame1 = $('#on-deck-game1');
        let onDeckInfo1 = $('#on-deck-info1');

        let onDeckGame2 = $('#on-deck-game2');
        let onDeckInfo2 = $('#on-deck-info2');

        onDeckGame1.text('A Hat in Time');
        onDeckInfo1.text('Any% - flarebear');
        runFitText('#on-deck-game1', onDeckGameWidth);
	    runFitText('#on-deck-info1', onDeckInfoWidth);

        onDeckGame2.text('Fire Emblem: Three Houses');
        onDeckInfo2.text('Golden Deer - Claris');
        runFitText('#on-deck-game2', onDeckGameWidth);
	    runFitText('#on-deck-info2', onDeckInfoWidth);
    }

    // (As of writing) triggered from a dashboard button and also when a run's timer ends
    // nodecg.listenFor('forceRefreshIntermission', speedcontrolBundle, () => {
    //     refreshNextRunsData(runDataActiveRun.value);
    // });

    function loadFromSpeedControl() {
        // This is where the information is received for the run we want to display.
        // The "change" event is triggered when the current run is changed.
        runDataActiveRun.on('change', (newVal, oldVal) => {
            refreshNextRunsData(newVal);
        });

        runDataArray.on('change', (newVal, oldVal) => {
            refreshNextRunsData(runDataActiveRun.value);
        });
    }

    function getNamesForRun(runData) {
        let currentTeamsData = getRunnersFromRunData(runData);
        let names = [];
        for (let team of currentTeamsData) {
            for (let player of team.players) {
                names.push(player.name);
            }
        }
        return names;
    }

    function refreshNextRunsData(currentRun) {
        const numUpcoming = 3;
        let nextRuns = getNextRuns(currentRun, numUpcoming);

        let comingUpGame = $('.coming-up-name');
        let comingUpRunner = $('.coming-up-runner');

        // Next up game.
        comingUpGame.html(currentRun.game);
        comingUpRunner.html(getNamesForRun(runDataActiveRun.value).join(', '));

        // On deck games.
        let i = 0;
        for (let run of nextRuns) {
            i += 1;
            let onDeckGame = $(".on-deck-name" + i);
            let onDeckRunner = $(".on-deck-runner" + i);
            onDeckGame.html(run.game).show();
            onDeckRunner.html(getNamesForRun(run).join(', ')).show();
        }

        // Hide extra on deck games we don't need.
        for (let j = i + 1; j <= numUpcoming; j++) {
            $(".on-deck-name" + j).hide();
            $(".on-deck-runner" + j).hide();
        }
    }
});
