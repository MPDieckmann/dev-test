import "./config";
import { ConsoleModule } from "./ace-consolemodule";

document.body.appendChild(new ConsoleModule(self).element);