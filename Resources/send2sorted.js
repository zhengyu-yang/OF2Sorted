(() => {
    // Recursively chain the x call bark url together. This seems to be the only way to send a batch of task to another app through url scheme.
    function recursiveTaskURLChian(tasks){
        let nextTask = tasks.shift();
        
        if (nextTask) {
            createSortedURLScheme(nextTask).call(
                (()=>{recursiveTaskURLChian(tasks)}), 
                (()=>{
                    let failAlert = new Alert("Send to Sorted", "Fail to send a task");
                    failAlert.show((result)=>{});
                }));
        } else {
            URL.fromString("sorted://").open();
        }
    }

    function createSortedURLScheme(task){
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: 'numeric' }) 
        const [{value: m},,{value: d},,{ value: y}] = dateTimeFormat.formatToParts(new Date()) 


        let durationOption = "";
        if (typeof task.estimatedMinutes === "number"){
            durationOption = `&duration=${Math.round(task.estimatedMinutes)}`;
        }
        
        return URL.fromString(`sorted://x-callback-url/add?title=${encodeURIComponent(task.name)}%0A${encodeURIComponent(task.hierarchyString)}&list=OmniFocus&date=${y}-${m}-${d}${durationOption}`);
        //For Debug
        //return URL.fromString(`bear://x-callback-url/create?title=${encodeURI(task.name)}`);
        //return URL.fromString("https://google.com");
    }

    // refer to https://github.com/ksalzke/function-library-for-omnifocus/blob/master/functionLibrary.omnijs
    // get parent of an action
    function getParent(task){
        let parent = null;
        let project = null;
        if (task.containingProject == null) {
            project = inbox;
        } else {
            project = task.containingProject.task;
        }
        project.apply((item) => {
          if (item.children.includes(task)) {
            parent = item;
            return ApplyResult.Stop;
          }
        });
        return parent;    
    }

    // get the hierarchy of actions in "Parent ▶ Child" format
    function getHierarchyString(task){
        let parent =  getParent(task);
        if (parent !== null){
            return `${getHierarchyString(parent)} ▶ ${task.name}`;
        } else {
            return `▶ ${task.name}`;
        }
    }
    
    let action = new PlugIn.Action(
        (selection, sender) => {
            if (selection.tasks.length > 0){
                // In MacOS version of OF3, directly pass selection.tasks to recursiveTaskURLChian() can cause selection.tasks to be invalidated. 
                // 1. This only happens in MacOS version of OF3. In iOS version, selection.tasks wont be invalidated.
                // 2. In MacOS version, if you have activated the console once, then selection.tasks wont be invalidated no matter console is shown or hidden.
                let tasks_cache = [];
                for (const t of selection.tasks){
                    tasks_cache.push({
                        name: t.name, 
                        estimatedMinutes: t.estimatedMinutes,
                        hierarchyString: getHierarchyString(t)
                    });
                }
                recursiveTaskURLChian(tasks_cache);
            }

            if (selection.projects.length > 0){
                let projects_cache = [];
                for (const p of selection.projects){
                    projects_cache.push({
                        name: `📁 ${p.name}`, 
                        estimatedMinutes: p.estimatedMinutes,
                        hierarchyString: getHierarchyString(p)
                    });
                }
                recursiveTaskURLChian(projects_cache);
            }
        }
    );
    
    action.validate = (selection, sender) => {
        return (selection.tasks.length > 0 || selection.projects.length > 0);
    };

    return action;
})(); 


