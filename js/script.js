function calculate() {
    var ipInput = document.getElementById("ipInput").value;
    var resultElement = document.getElementById("result");

    if (!isValidIP(ipInput)) {
        resultElement.innerHTML = '<p class="error-message">Adresse IP invalide. Veuillez entrer une adresse IP valide.</p>';
        return;
    }
    var octets = ipInput.split('.');

    var ipClass;
    if (octets[0] >= 1 && octets[0] <= 126) {
        ipClass = "A";
    } else if (octets[0] >= 128 && octets[0] <= 191) {
        ipClass = "B";
    } else if (octets[0] >= 192 && octets[0] <= 223) {
        ipClass = "C";
    } else {
        resultElement.innerHTML = "Classe d'adresse IP non supportée.";
        return;
    }

    var mask;
    if (ipClass === "A") {
        mask = "255.0.0.0";
    } else if (ipClass === "B") {
        mask = "255.255.0.0";
    } else if (ipClass === "C") {
        mask = "255.255.255.0";
    }

    var networkAddress = octets.slice(0, 3).join('.') + ".0";
    var startRange = networkAddress + ".1";
    var endRange = networkAddress + ".254";

    resultElement.innerHTML = `
        Adresse IP: ${ipInput} <br>
        Classe: ${ipClass} <br>
        Masque Réseau: ${mask} <br>
        Plage d'Adresse IP: de ${startRange} à ${endRange}
    `;
}

function isValidIP(ip) {


    var octets = ip.split('.');
    if (octets.length !== 4) {
        return false;
    }

    for (var i = 0; i < 4; i++) {
        var octet = parseInt(octets[i]);
        if (isNaN(octet) || octet < 0 || octet > 255) {
            return false;
        }
    }

    return true;
}
