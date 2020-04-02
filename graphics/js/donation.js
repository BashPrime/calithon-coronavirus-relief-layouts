'use strict';
$(() => {
	const TILTIFY_CAMPAIGN_ID = 43898; // id for calithon covid relief cmpaign
	const TILTIFY_AUTH_TOKEN = null;

	if (isOffline) {
		loadOffline();
	} else {
		if (TILTIFY_CAMPAIGN_ID && TILTIFY_AUTH_TOKEN) {
			const pollInterval = setInterval(() => loadFromTiltifyApi(), 5000); // run every 5 seconds
			loadFromTiltifyApi();
		} else {
			alert('Cannot request Tiltify API - check TILTIFY_CAMPAIGN_ID and TILTIFY_AUTH_TOKEN');
		}

	}

	function loadOffline() {
		$('#donation-total').html('$12,345');
	}

	function loadFromTiltifyApi() {
		$.ajax({
			url: `https://tiltify.com/api/v3/campaigns/${TILTIFY_CAMPAIGN_ID}`,
			type: 'get',
			headers: {
				'Authorization': `Bearer ${TILTIFY_AUTH_TOKEN}`
			},
			dataType: 'json',
			success: (response) => {
				const formatter = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				});
				$('#donation-total').html(formatter.format(response.data.totalAmountRaised));
			}
		});
	}
});
