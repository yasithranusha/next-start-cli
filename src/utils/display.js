import chalk from "chalk";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";

export const showWelcomeMessage = async () => {
  return new Promise((resolve) => {
    figlet.text("Next.js CLI", {
      horizontalLayout: "full",
    }, (err, data) => {
      if (err) {
        console.error("Something went wrong with Figlet");
        return;
      }
      const glitchText = chalkAnimation.glitch(data);
      
      // Stop animation after 2 seconds
      setTimeout(() => {
        glitchText.stop();
        console.log(gradient.instagram("\nWelcome to Next.js CLI"));
        resolve();
      }, 2000);
    });
  });
};