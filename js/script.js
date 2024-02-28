function redirigerVersLien(lien) {
    // Remplacez 'BASE_URL' par la base URL de votre site si nécessaire.
    // Ajoutez des liens spécifiques pour "Adresse IP" et "Masque de sous-réseau".
    var base_url = 'BASE_URL'; // Remplacez par la base URL de votre site si nécessaire.
    var url;

    switch (lien) {
        case 'lien_adresse_ip':
            url = 'https://www.jechange.fr/telecom/internet/adresse-ip';
            break;
        case 'lien_masque_reseau':
            url = 'https://www.cloudflare.com/fr-fr/learning/network-layer/what-is-a-subnet/';
            break;
        default:
            url = base_url;
    }

    // Redirection vers le lien spécifié.
    window.location.href = url;
}

function calculate() {
    var button = document.getElementById('calculateButton');
    var ipAddress = document.getElementById('ipAddress').value;
    var subnetMask = document.getElementById('subnetMask').value;

    if (button.innerHTML === 'Calculer') {
        // Annuler
        button.style.backgroundColor = '#ff5050';
        button.innerHTML = 'Annuler';

        // Verif input
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

        var firstHostArray = networkArray.slice();  
        firstHostArray[3] += 1;  

        var lastHostArray = broadcastArray.slice();  
        lastHostArray[3] -= 1;  

        var firstHost = firstHostArray.join('.');
        var lastHost = lastHostArray.join('.');

        var cidr = subnetArray.reduce(function (count, octet) {
            return count + octet.toString(2).split('1').length - 1;
        }, 0);

        var results = "<strong>" + "Adresse IP: " + "</strong>" + ipArray.join('.') + "<br>" +
            "<strong>" + "Masque de sous-réseau: " + "</strong>" + subnetArray.join('.') + "<br>" +
            "<strong>" + "Adresse réseau: "  + "</strong>" + networkArray.join('.') + "<br>" +
            "<strong>" + "Première adresse IP du réseau: " + "</strong>" + firstHost + "<br>" +
            "<strong>" + "Dernière adresse IP du réseau: " + "</strong>" + lastHost + "<br>" +
            "<strong>" + "Adresse de diffusion: " + "</strong>" + broadcastArray.join('.') + "<br>" +
            "<strong>" + "CIDR: /" + "</strong>" + cidr + "<br>" +
            "<strong>" + "Classe: " + "</strong>" + ipClass + "<br>";

        document.getElementById('results').innerHTML = results;
        document.getElementById('calculator').classList.add('results-shown');

    } else if (button.innerHTML === 'Annuler') {
        resetCalculateButton();
        document.getElementById('results').innerHTML = '';

        document.getElementById('calculator').classList.remove('results-shown');
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
