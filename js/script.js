function calculate() {
    var ipAddress = document.getElementById('ipAddress').value;
    var subnetMask = document.getElementById('subnetMask').value;

    // Vérification des champs
    if (!ipAddress || !subnetMask) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // Vérification de l'adresse IP
    if (!isValidIP(ipAddress)) {
        alert("Adresse IP invalide.");
        return;
    }

    // Conversion des adresses IP et masques en tableau de nombres
    var ipArray = ipAddress.split('.').map(Number);
    var subnetArray = subnetMask.split('.').map(Number);

    // Calcul de la classe de l'adresse IP
    var ipClass = calculateIPClass(ipArray[0]);

    // Calcul de l'adresse réseau
    var networkArray = ipArray.map(function (octet, index) {
        return octet & subnetArray[index];
    });

    // Calcul de l'adresse de diffusion
    var broadcastArray = ipArray.map(function (octet, index) {
        return (octet & subnetArray[index]) | (~subnetArray[index] & 255);
    });

    // Calcul du CIDR
    var cidr = subnetArray.reduce(function (count, octet) {
        return count + octet.toString(2).split('1').length - 1;
    }, 0);

    // Affichage des résultats
    var results = "Adresse IP: " + ipArray.join('.') + "<br>" +
                  "Masque de sous-réseau: " + subnetArray.join('.') + "<br>" +
                  "Adresse réseau: " + networkArray.join('.') + "<br>" +
                  "Adresse de diffusion: " + broadcastArray.join('.') + "<br>" +
                  "CIDR: /" + cidr + "<br>" +
                  "Classe: " + ipClass + "<br>";

    document.getElementById('results').innerHTML = results;
}

function isValidIP(ip) {
    var ipRegex = /^(\d{1,3}\.){3}(\d{1,3})$/;
    return ipRegex.test(ip);
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
