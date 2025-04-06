import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient();

async function detectFace(fileName: string): Promise<void> {
    try {
        console.log(`Running logo detection on ${fileName}`);
        const [result] = await client.logoDetection(fileName);
        let scores: number[] = [];
        const logos = result.logoAnnotations;
        logos?.forEach((logo) => {
            if (logo.description)
                console.log(`"${logo.description}" found in file ${fileName}`);
            if (logo.score)
                scores.push(logo.score);
        });
        if (scores.length > 0) {
            const avg = scores.reduce((a, b) => a + b) / scores.length;
            console.log(`Average score for ${fileName}: ${avg}`);
        } else {
            console.log(`No logos detected in ${fileName}`);
        }
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            console.log(`File ${fileName} not found`);
        } else {
            console.error(`Error processing file ${fileName}: ${err.message}`);
        }
    }
}

/**
 * Runs logo detection on the given list of file names and logs the description and average score of each logo.
 * @param fileNames - An array of file names to run logo detection on.
 * @returns void
 */
async function mainAsync(fileNames: string[]): Promise<void> {
    for (const fileName of fileNames) {
        await detectFace(fileName);
    }
}

// Call mainAsync to run the logo detection asynchronously on the list of file names
mainAsync([
    './images/cmu.jpg', 
    './images/logo-types-collection.jpg', 
    './images/not-a-file.jpg'
]);
