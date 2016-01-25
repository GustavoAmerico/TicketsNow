var rsx = {
    hostname: "/api/api",
    nomeApp: "Tickets Now",
    label: {
        validMonth: "Valid month",
        validYear: "Valid year",
        shoppingCart: "Shopping Cart",
        title: "Title",
        image: "Image",
        total: "Total",
        description: "Description",
        action: "action",
        buy: "Buy",
        unitPrice: "Unit Price",
        register: "Register",
        male: "Male",
        female: "Female",
        personal: "Personal",
        contact: "Contact",
        account: "Account",
        name: "Name",
        cartNumber: "Number of Card",
        cvv: "CVV"
    },
    menu: {
        cart: "Cart",
        dashboard: "Home",
        usuarios: "Usuários",
    },
    pageTitles: {
        home: "Home - Tickets Now",
        cart: "Cart - Tickets Now",
        login: "Login - Tickets Now",
        register: "Register - Tickets Now"
    },
    titulosPg: {
        Registrese: "Register"
    },
    input: {
        title: {
            fullName: "Enter your full name. It must be between 8 and 150 letters",
            email: "Please enter a valid email address in the format: xxx@xxx.xxx",
            resennha: "Repita o valor digitado no campo senha",
            password: "Enter a secure password. She must have 6-32 caracters including letters, numbers and symbols",
            confirmPassword: " Confirm password",
            numberTickets: "Number of tickets",
            birthDate: "What is your birth date?",
            gender: "What is your gender?",
            state: "What is  your state or  province?",
            zipCode: "What is the zip code of your address? (only numbers)",
            city: "City"
        },
        placeholder: {
            fullName: "Full name",
            email: "E-mail",
            confirmPassword: " confirm password",
            password: "Password",
            zipCode: "Zip Code",
            street: "street",
            state: "State",
            city: "City"
        },
        pattern: {
            fullName: "^(([a-zA-Zá-ùÁ-Ú]{2,10})([ ][a-zA-Zá-ùÁ-Ú]{2,10}){1,5})$",
            email: "^([a-z0-9][a-z0-9-.]{0,32}[a-z0-9])(\\@[a-z0-9][a-z0-9-]{0,32}[a-z0-9])((?:\\.[a-z]{2,5}){1,2})$",
            password: "^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\/\\*\\-\\+\\.\\])\\(\\&\\%\\$\\#\\@\\!]).{6,32})$",
            cpf: "^(\\d{3}[.]\\d{3}[.]\\d{3}[-]\\d{2})$"
        },
    },
    button: {
        save: "Save",
        login: "Login",
        addToBuy: "add to cart"
    },
    msgs: {
        jaTenhoConta: "Already registered? Login into your account",
        esqueciSenha: "Esqueci minha senha",
        criarConta: "Criar uma conta",
        permanecerConectado: "Permanecer conectado",
        ticketReserved: "Your cart has been updated, {0} tickets for {1} reserved",
    },
    rotas: {
        login: {
            url: "/publico/login.html",
            nome: "/"
        },
        registro: {
            nome: "/registro",
            url: "/publico/registro.html",
        },
    }
};
var eventos = [
    {
        id: 1,
        title: "Titulo do Evento I",
        description: "Vivamus rhoncus venenatis diam, id fringilla dolor vestibulum in. Donec luctus commodo consectetur. Curabitur euismod sapien non velit fermentum scelerisque. Nullam cursus ipsum id augue pulvinar porttitor.",
        image: "https://acqualokos.files.wordpress.com/2013/03/capao_fest.png",
        price: 150.50
    }, {
        id: 2,
        title: "Tituolo do Evento II",
        description: "Descrição do evento II",
        image: "https://acqualokos.files.wordpress.com/2013/03/capao_fest.png",
        price: 250.01
    }, {
        id: 3,
        title: "Tituolo do Evento III",
        description: "Vivamus rhoncus venenatis diam, id fringilla dolor vestibulum in. Donec luctus commodo consectetur. Curabitur euismod sapien non velit fermentum scelerisque. Nullam cursus ipsum id augue pulvinar porttitor.",
        image: "https://acqualokos.files.wordpress.com/2013/03/capao_fest.png",
        price: 350.00
    }, {
        id: 4,
        title: "Tituolo do Evento IV",
        description: "Vivamus rhoncus venenatis diam, id fringilla dolor vestibulum in. Donec luctus commodo consectetur. Curabitur euismod sapien non velit fermentum scelerisque. Nullam cursus ipsum id augue pulvinar porttitor.",
        image: "https://acqualokos.files.wordpress.com/2013/03/capao_fest.png",
        price: 450.00
    },
    {
        id: 5,
        title: "Tituolo do Evento V",
        description: "Vivamus rhoncus venenatis diam, id fringilla dolor vestibulum in. Donec luctus commodo consectetur. Curabitur euismod sapien non velit fermentum scelerisque. Nullam cursus ipsum id augue pulvinar porttitor.",
        image: "https://acqualokos.files.wordpress.com/2013/03/capao_fest.png",
        price: 550.00
    }
];