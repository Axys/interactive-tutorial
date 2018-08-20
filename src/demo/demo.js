import "./demo.scss";
import interactiveTutorial from '../interactiveTutorial';
import pikachu from "./media/pikachu.gif";

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('startDemoBtn').addEventListener('click', () => interactiveTutorial(tutorialParams));

    var tutorialElements = [{
            id: 'page-title',
            ttipText: 'This is the website title. The tooltip is placed according to the available space.'
        },
        {
            id: 'compatibility',
            ttipText: 'The tooltip is generally placed on the top left of the element.',
            cb: function(){ 
                    return new Promise((resolve, reject) => {
                    let runner = document.getElementById('runner');
                    runner.style.display = 'block';
                    document.body.classList.add('show-runner');
        
                    setTimeout(()=>{
                        runner.style.display = 'none';
                        document.body.classList.remove('show-runner');
                        resolve();
                    },3000);
                })
            },
            // or you could use a function, if you don't want the tutorial to wait for it to end.
            /*
            cb: function () {
                let runner = document.getElementById('runner');
                runner.style.display = 'block';
                document.body.classList.add('show-runner');

                setTimeout(()=>{
                    runner.style.display = 'none';
                    document.body.classList.remove('show-runner');
                },3000);
            }, */
            interactive: false
        },
        {
            id: 'startDemoBtn',
            ttipText: 'The confirmation button text can be customized via the <code class="code-white">confirmBtnText</code> property',
            confirmBtnText: 'END TUTORIAL',
            interactive: false
        }
    ];
    var tutorialParams = {
        tutorialElements: tutorialElements,
        confirmBtn: true,
        preventDefault: true,
        theme: 'it_theme__green',
        tutorialEndCallback: function () {
            console.log('tutorial ended.');
        }
    }
});