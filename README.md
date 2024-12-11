## Setup
1.Run `pnpm install`
2. `cd` into `/static` and run:
    ```
    pnpm install
    pnpm run build
    ```
3. From the project root register the app with `forge register`
4. Deploy the app with `forge deploy`


## User Guide
1. Create a global automation
2. Select issue created as the trigger
3. Select Use Rovo Avent as the action
    1. Select the `Collaboration Assistant Agent` as the Rovo Agent.
    2. Use `Use the prompt provided in the forge manifest.` for the prompt.
    The automation should look like this:![image](https://github.com/user-attachments/assets/6dc7c90f-5b38-41cb-8594-3c83f4027f5f)
4. Next, create a JSM request
5. After the automation runs successfully, the list of suggested similar issues and potential collaborators should be populated in the issue context view.
    1. Note: Potential Collaborators are obtained from the assignees of previous issues/requests  
