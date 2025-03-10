import inquirer from "inquirer";

export let projectName;
export let nextJsVersion;

export const getProjectDetails = async () => {
  const questions = [
    {
      type: "input",
      name: "projectName",
      message: "Enter the project name:",
      required: true,
      default() {
        return "my-app";
      },
    },
    {
      type: "input",
      name: "nextJsVersion",
      message: "Enter the Next.js version: ",
      default() {
        return "latest";
      },
    },
  ];

  const answers = await inquirer.prompt(questions);
  projectName = answers.projectName;
  nextJsVersion = answers.nextJsVersion;
  
  return projectName;
};