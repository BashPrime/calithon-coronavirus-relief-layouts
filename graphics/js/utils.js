function runFitText(selector, baseWidth) {
    $(selector).css('font-size', '');
    let selectorWidth = getAutoWidth(selector);

    if (selectorWidth >= baseWidth) {
        $(selector).fitText(selectorWidth / baseWidth);
    }
}

function getAutoWidth(selector) {
	$(selector).css('width', 'auto');
	const width = $(selector).innerWidth();
	$(selector).css('width', '');
	return width;
}

// Get team info from run data.
function getRunnersFromRunData(runData) {
    let currentTeamsData = [];
    runData.teams.forEach(team => {
        let teamData = {players: [], id: team.id};
        team.players.forEach(player => {teamData.players.push(createPlayerData(player));});
        currentTeamsData.push(teamData);
    });
    return currentTeamsData;
}

// Easy access to create member data object used above.
function createPlayerData(player) {
    // Gets username from URL.
    let twitchUsername = '';
    if (player.social && player.social.twitch) {
        twitchUsername = player.social.twitch;
    }

    // Parse pronouns from the runner name, if they're present.
    let name = player.name.split('-');
    let pronouns = '';
    if (name.length > 1) {
        pronouns = name[1].trim();
    }
    name = name[0].trim();

    return {
        id: player.id,
        teamID: player.teamID,
        name: name,
        pronouns: pronouns,
        twitch: twitchUsername,
        region: player.region
    };
}
