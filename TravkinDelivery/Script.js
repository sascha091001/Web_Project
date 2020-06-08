let AdmArea = document.getElementById('okrug');
let District = document.getElementById('rayon');
let TypeObject = document.getElementById('type');
let finder = document.getElementById('finder');
let Discount = document.getElementById('discount');

let Choose_Rest; 
let AllPrice = 0;
let Restaurant;

console.log(Discount);

let Res; //Наш список

function getRestaurants(){
	let obXhr = new XMLHttpRequest();
	
	obXhr.open('GET', 'http://exam-2020-1-api.std-400.ist.mospolytech.ru/api/data1');
	obXhr.send();
	
	obXhr.onreadystatechange = function(){
		if(obXhr.readyState != 4) return;

		if(obXhr.response){
			let result = JSON.parse(obXhr.response);
			console.log(result);
			
			for (let i = 0; i < result.length - 1; i++){
				for (let j = 0; j < result.length - 1; j++){
					if (result[j].rate < result[j+1].rate){
						let temp = result[j];
						result[j] = result[j+1]
						result[j+1] = temp;
					}
				}
			}
			
			Res = result;
			console.log(result);
			
			let AllOkrugs = result.reduce(function(prev, curr){
				return [...prev, curr.admArea];
			}, [])
					
			let AllRayons = result.reduce(function(prev, curr){
				return [...prev, curr.district];
			}, [])
			
			let AllTypes = result.reduce(function(prev, curr){
				return [...prev, curr.typeObject];
			}, [])
			
			//console.log(AllOkrugs);
			//console.log(AllRayons);
			//console.log(AllTypes);
			
			let filter = function(Arr){
				let temp = {};				
				return Arr.filter(function(a){
					return a in temp ? 0 : temp[a] = 1;
				});
			};
			
			
			for (let key in filter(AllOkrugs)){
				let okrug = document.createElement('option');
				okrug.innerHTML = `
					<div>
						<h6> ${filter(AllOkrugs)[key]} </h6>
					</div>
				`
				
				AdmArea.append(okrug);
			}
			
			for (let key in filter(AllRayons)){
				let rayon = document.createElement('option');
				rayon.innerHTML = `
					<div>
						<h6> ${filter(AllRayons)[key]} </h6>
					</div>
				`
				
				District.append(rayon);
			}
			
			for (let key in filter(AllTypes)){
				let types = document.createElement('option');
				types.innerHTML = `
					<div>
						<h6> ${filter(AllTypes)[key]} </h6>
					</div>
				`
				
				TypeObject.append(types);
			}
		}
	}	
}

function Chooser(){
	//console.log(event.target.parentNode.parentNode.children[0]);
	
	let Name = event.target.parentNode.parentNode.children[0].innerText;
	let Address = event.target.parentNode.parentNode.children[2].innerText;
	let Rest;
	
	for (let key in Res){
		if (Res[key].address == Address && Res[key].name == Name){
			Rest = Res[key];
		}
	}
	
	console.log(Rest);
	Restaurant = Rest; // Для модального окна
	let Prices = Object.values(Rest); //Преобразование из объекта в массив
	
	console.log(Prices);
	Prices.splice(0, 15);   //Оставляем только сет
	console.log(Prices);
	
	//console.log(Name);
	//console.log(Address);
	
	let obXhr = new XMLHttpRequest();
	
	obXhr.open('GET', 'RestInfo');
	obXhr.send();
	
	let MenuBlock = document.getElementById('menu');
	console.log(MenuBlock);
	
	MenuBlock.innerHTML = '';
	
	let Total = document.getElementById('Total');
	console.log(Total);
	Total.innerHTML = '';
	
	obXhr.onreadystatechange = function(){
		if(obXhr.readyState != 4) return;

		if(obXhr.response){
			let result = JSON.parse(obXhr.response);
			
			console.log(result);
	
			for (let i in result){
				let set = document.createElement('div');
				set.className = "col-sm-4 col-12"
			
				set.innerHTML = `
				
					<p> <img src = "${result[i].url}" width = "100%"> </p>
					<h5 class = "text-center text-danger"> ${result[i].name} </h5>
					<p> Краткое описание: ${result[i].description} </p>	
					<h4 class = "text-center"> ${Prices[i]} Рубля(лей) </h4>
					<p class = "text-center"> <button id = "butMin"> - </button> <input style = "width: 40px" value = "0"> <button id = "butPl"> + </button> </p>
				`
				
				MenuBlock.append(set);
			}
			
			let Buts_p = document.querySelectorAll('#butPl');
			//console.log(Buts_p);
			
			for (let but of Buts_p){
				but.addEventListener('click', plus);  //+1 к заказу
			}
			
			let Buts_m = document.querySelectorAll('#butMin');    //Прописать завтра 2 кнопки(2 функции добавить)
			//console.log(Buts_m); 	
			for (let but of Buts_m){
				but.addEventListener('click', minus);  //-1 к заказу
			}
		}
	}
}

function plus(){
	event.target.parentNode.children[1].value++;
	
	
	let Price = event.target.parentNode.parentNode.children[3].innerText;
	console.log(Price);
	
	var numEl = '';

	for (var index in Price) {
	  if (Price[index] >= 0 && Price[index] <= 9) {
		numEl += Price[index];
	  }
	}
	
	parseInt(numEl);
	console.log(numEl);
	
	AllPrice = Number(AllPrice) + Number(numEl);
	console.log(AllPrice);
	
	let Total = document.getElementById('Total');
	console.log(Total);
	
	Total.innerHTML = '';
	
	let newH5 = document.createElement('H5');
	
	newH5.innerHTML = `
	Итого: ${AllPrice} Рубля(лей)
	`
	
	Total.append(newH5);
}

function minus(){
	if (event.target.parentNode.children[1].value > 0){
		event.target.parentNode.children[1].value--;
		
		let Price = event.target.parentNode.parentNode.children[3].innerText;
		console.log(Price);
		
		var numEl = '';

		for (var index in Price) {
		  if (Price[index] >= 0 && Price[index] <= 9) {
			numEl += Price[index];
		  }
		}
		
		parseInt(numEl);
		console.log(numEl);
		
		AllPrice = Number(AllPrice) - Number(numEl);
		console.log(AllPrice);
		
		let Total = document.getElementById('Total');
		
		Total.innerHTML = '';
		
		let newH5 = document.createElement('H5');
		
		newH5.innerHTML = `
		Итого: ${AllPrice} Рубля(лей)
		`
		
		Total.append(newH5);
	}
}

function findRestaurants(){
    let Sel_Area = AdmArea.value;
	let Sel_Dist = District.value;
	let Sel_Type = TypeObject.value;
	let Sel_Disc = Discount.value;
	
	let a = true; //4 буля для пустых полей
	let b = true;
	let c = true;
	let d = true;
	
	let counter = 0; //для 20 записей
	
	if (Sel_Area == "Не выбрано"){
		a = false;
	}
		
	if (Sel_Dist == "Не выбрано"){
		b = false;
	}
		
	if (Sel_Type == "Не выбрано"){
		c = false;
	}
		
	if (Sel_Disc == "Не выбрано"){
		d = false;
	}

	
	let Places = document.getElementById('Places');
	//console.log(Places);
	Places.innerHTML = "";
	
	let MenuBlock = document.getElementById('menu');
	//console.log(MenuBlock);
	MenuBlock.innerHTML = '';
	
	/*let Total = document.getElementById('Total');
	console.log(Total);
	Total.innerHTML = '';*/
	
	for (let i in Res){
		if (a == false){
			Sel_Area = Res[i].admArea;
		}
		
		if (b == false){
			Sel_Dist = Res[i].district;
		}
		
		if (c == false){
			Sel_Type = Res[i].typeObject;
		}
		
		if (d == false){
			Sel_Disc = Res[i].socialPrivileges;
		}
		
		if (Res[i].admArea == Sel_Area && Res[i].district == Sel_Dist && Res[i].typeObject == Sel_Type && Res[i].socialPrivileges == Sel_Disc){
			console.log(Res[i]);
			
			let newDiv = document.createElement('div');
			newDiv.className = "row border border-primary";
			
			newDiv.innerHTML = `
				<div class = "col-3">
					<h6> ${Res[i].name} </h6>
				</div>
						
				<div class = "col-3">
					<h6> ${Res[i].typeObject} </h6>
				</div>
						
				<div class = "col-3">
					<h6> ${Res[i].address} </h6>
				</div>
						
				<div class = "col-3">
					<button id = "but" class = "form-control"> Выбрать </button>
				</div>
			`
			
			Places.append(newDiv);
			counter++;
			
			if (counter == 20){
				break;
			}
		}
	}
	
	let Choose = document.querySelectorAll('#but');
	
	for (let butt of Choose){ 
		butt.addEventListener('click', Chooser);
	}
}

getRestaurants()
finder.addEventListener('click', findRestaurants);


