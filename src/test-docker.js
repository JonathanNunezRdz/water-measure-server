const { exec } = require('child_process');
const { type } = require('os');
const { join } = require('path');

const main = async () => {
	let runDocker;
	if (type() === 'Windows_NT') {
		runDocker = () => {
			console.log('Trying to run docker');
			const command = join(
				'C:',
				`"Program Files"`,
				'Docker',
				'Docker',
				'"Docker Desktop.exe"'
			);

			exec(command, (error) => {
				if (error !== null) {
					console.log('Error tyring to run Docker Deskop.exe');
					console.log(error);
					return;
				}
				process.exitCode = 1;
				return;
			});
		};
	}

	exec('docker info', (error) => {
		if (error !== null) {
			if (runDocker) runDocker();
			return;
		}
		console.log('Docker is already running... skipping');
	});
};

main();
