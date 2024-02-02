function calculate() {
    var button = document.getElementById('calculateButton');
    var ipAddress = document.getElementById('ipAddress').value;
    var subnetMask = document.getElementById('subnetMask').value;

    if (button.innerHTML === 'Calculer') {
        //Annuler
        button.style.backgroundColor = '#ff5050';
        button.innerHTML = 'Annuler';

        //Verif input
        if (!ipAddress || !subnetMask) {
            alert("Veuillez remplir tous les champs.");
            resetCalculateButton();
            return;
        }

        // Verif IP
        if (!isValidIP(ipAddress)) {
            alert("Adresse IP invalide.");
            resetCalculateButton();
            return;
        }

        // Vérif Masque réseau
        if (!isValidSubnetMask(subnetMask)) {
            alert("Masque de sous-réseau invalide.");
            resetCalculateButton();
            return;
        }

        var ipArray = ipAddress.split('.').map(Number);
        var subnetArray = subnetMask.split('.').map(Number);

        var ipClass = calculateIPClass(ipArray[0]);

        var networkArray = ipArray.map(function (octet, index) {
            return octet & subnetArray[index];
        });

        var broadcastArray = ipArray.map(function (octet, index) {
            return (octet & subnetArray[index]) | (~subnetArray[index] & 255);
        });

        var cidr = subnetArray.reduce(function (count, octet) {
            return count + octet.toString(2).split('1').length - 1;
        }, 0);

        var results = "Adresse IP: " + ipArray.join('.') + "<br>" +
                      "Masque de sous-réseau: " + subnetArray.join('.') + "<br>" +
                      "Adresse réseau: " + networkArray.join('.') + "<br>" +
                      "Adresse de diffusion: " + broadcastArray.join('.') + "<br>" +
                      "CIDR: /" + cidr + "<br>" +
                      "Classe: " + ipClass + "<br>";

        document.getElementById('results').innerHTML = results;

    } else if (button.innerHTML === 'Annuler') {
        resetCalculateButton();
        document.getElementById('results').innerHTML = '';
    }
}

function resetCalculateButton() {
    var button = document.getElementById('calculateButton');
    button.style.backgroundColor = '#2c9b00';
    button.innerHTML = 'Calculer';
}

function isValidIP(ip) {
    var ipRegex = /^(\d{1,3}\.){3}(\d{1,3})$/;
    return ipRegex.test(ip);
}

function isValidSubnetMask(subnetMask) {
    var subnetRegex = /^(\d{1,3}\.){3}(\d{1,3})$/;
    if (!subnetRegex.test(subnetMask)) {
        return false;
    }
    var subnetArray = subnetMask.split('.').map(Number);
    return subnetArray.every(function (octet) {
        return octet === 0 || octet === 128 || octet === 192 || octet === 224 || octet === 240 || octet === 248 || octet === 252 || octet === 254 || octet === 255;
    });
}

function calculateIPClass(firstOctet) {
    if (firstOctet >= 1 && firstOctet <= 126) {
        return "A";
    } else if (firstOctet >= 128 && firstOctet <= 191) {
        return "B";
    } else if (firstOctet >= 192 && firstOctet <= 223) {
        return "C";
    } else if (firstOctet >= 224 && firstOctet <= 239) {
        return "D";
    } else if (firstOctet >= 240 && firstOctet <= 255) {
        return "E";
    } else {
        return "Unknown";
    }
}
