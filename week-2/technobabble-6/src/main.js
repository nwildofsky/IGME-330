        let words1;
        let words2;
        let words3;

        init();

        function generateBabble(num){

            function randomElement(array){
                return array[Math.floor(Math.random() * array.length)];
            }

            let output = "";
            for (let i = 0; i < num; i++) {
                const technobabble = `${randomElement(words1)} ${randomElement(words2)} ${randomElement(words3)}`;
                output = output + technobabble + "<br>";
            }

            document.querySelector("#output").innerHTML = output;
        }

        function loadJsonXHR() {
            const url = "data/babble-data.json";
            const xhr = new XMLHttpRequest();
            xhr.onload = (e) => {
                let json;
                try {
                    json = JSON.parse(e.target.responseText);
                }
                catch {
                    document.querySelector("#output").innerHTML = "Bad JSON!";
                    return;
                }

                words1 = json.words1;
                words2 = json.words2;
                words3 = json.words3;

                generateBabble(1);
            };
    
            xhr.onerror = (e) => {
                console.log(`In onerror - HTTP Status code = ${e.target.status}`);
                words1 = "Cannot";
                words2 = "Access";
                words3 = "Babble Data";
            };
            xhr.open("GET", url);
            xhr.send();
        }

        function init(){
            loadJsonXHR();
            const gen1 = document.querySelector("#my-button");
            gen1.onclick = () => generateBabble(1);
            const gen5 = document.querySelector("#gen-5");
            gen5.onclick = () => generateBabble(5);
        }