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

        function loadCSVXHR() {
            const url = "data/babble-data.csv";
            const xhr = new XMLHttpRequest();
            xhr.onload = (e) => {
                console.log(`In onload - HTTP Status Code = ${e.target.status}`);
                const text = e.target.responseText;
                console.log(`Success - the file length is ${text.length}`);
    
                const lines = text.split("\n");
                words1 = lines[0].split(",");
                words2 = lines[1].split(",");
                words3 = lines[2].split(",");

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
            loadCSVXHR();
            const gen1 = document.querySelector("#my-button");
            gen1.onclick = () => generateBabble(1);
            const gen5 = document.querySelector("#gen-5");
            gen5.onclick = () => generateBabble(5);
        }