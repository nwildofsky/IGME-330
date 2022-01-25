        let words1;
        let words2;
        let words3;

        loadXMLXHR();

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

        function loadXMLXHR() {
            const url = "data/babble-data.xml";
            const xhr = new XMLHttpRequest();
            xhr.onload = (e) => {
                const xml = e.target.responseXML;
                if (!xml) {
                document.querySelector("#output").innerHTML = "XML is null!";
                return;
                }

                words1 = xml.querySelector("namelist[cid='words1']").textContent.split(",");
                words2 = xml.querySelector("namelist[cid='words2']").textContent.split(",");
                words3 = xml.querySelector("namelist[cid='words3']").textContent.split(",");

                generateBabble(1);
                const gen1 = document.querySelector("#my-button");
                gen1.onclick = () => generateBabble(1);
                const gen5 = document.querySelector("#gen-5");
                gen5.onclick = () => generateBabble(5);
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