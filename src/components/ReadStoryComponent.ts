const glob = require("glob");
const fs = require("fs");

const ReadStoryComponent = () => { 
  glob("./stories/*.json", (err: any, files: any) => { // read JSON files in this folder
    if(err) {
      console.log("cannot read the folder, something goes wrong with glob", err);
    }
    files.forEach( (file: any) => {
      fs.readFile(file, 'utf8', (err: any, data: any) => {
        // Read each file
        if(err) {
          console.log("cannot read the file, something goes wrong with the file", err);
        }
        var story = JSON.parse(data);
        console.log(story);
      });
    });
  });
}

export default ReadStoryComponent;