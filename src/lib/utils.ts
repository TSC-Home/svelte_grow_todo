export function calculateCountdown(secondsAgo: number) {
	// Ensure positive number
	const totalSeconds = Math.abs(Math.floor(secondsAgo));

	// Calculate time units
	const days = Math.floor(totalSeconds / (24 * 60 * 60));
	const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
	const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
	const seconds = totalSeconds % 60;

	// Create formatted strings with leading zeros
	const formatted = {
		days: String(days).padStart(2, '0'),
		hours: String(hours).padStart(2, '0'),
		minutes: String(minutes).padStart(2, '0'),
		seconds: String(seconds).padStart(2, '0')
	};

	return {
		raw: {
			days,
			hours,
			minutes,
			seconds,
			totalSeconds
		},
		formatted,
		toString: () =>
			`${formatted.days}:${formatted.hours}:${formatted.minutes}:${formatted.seconds}`,
		toObject: () => ({
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds
		})
	};
}
