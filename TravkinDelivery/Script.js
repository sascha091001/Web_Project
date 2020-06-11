let AdmArea = document.getElementById('okrug');
let District = document.getElementById('rayon');
let TypeObject = document.getElementById('type');
let finder = document.getElementById('finder');
let Discount = document.getElementById('discount');

let last_but = document.getElementById('but1');

let Student_d = document.getElementById('Student');
let Fast_d = document.getElementById('Fast');

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
			
			SortByA(AllOkrugs);
					
			let AllRayons = result.reduce(function(prev, curr){
				return [...prev, curr.district];
			}, [])
			
			SortByA(AllRayons);
			
			let AllTypes = result.reduce(function(prev, curr){
				return [...prev, curr.typeObject];
			}, [])
			
			SortByA(AllTypes);
			
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
						<p> ${filter(AllOkrugs)[key]} </p>
				`
				
				AdmArea.append(okrug);
			}
			
			for (let key in filter(AllRayons)){
				let rayon = document.createElement('option');
				rayon.innerHTML = `
						<p> ${filter(AllRayons)[key]} </p>
				`
				
				District.append(rayon);
			}
			
			for (let key in filter(AllTypes)){
				let types = document.createElement('option');
				types.innerHTML = `
						<p> ${filter(AllTypes)[key]} </p>
				`
				
				TypeObject.append(types);
			}
		}
	}	
}

function Chooser(){
	//console.log(event.target.parentNode.parentNode.children[0]);
	AllPrice = 0;
	
	let Name = event.target.parentNode.parentNode.children[0].innerText;
	let Address = event.target.parentNode.parentNode.children[2].innerText;
	let Type = event.target.parentNode.parentNode.children[1].innerText;
	
	let Rest;
	
	for (let key in Res){
		if (Res[key].address == Address && Res[key].name == Name && Res[key].typeObject == Type){
			Rest = Res[key];
		}
	}
	
	console.log(Rest);
	Restaurant = Rest; // Для модального окна
	let Prices = Object.values(Rest); //Преобразование из объекта в массив
	
	//console.log(Prices);
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
					<h4 class = "text-center"> <span>${Prices[i]}</span> Р. </h4>
					<p class = "text-center"> <button id = "butMin"> - </button> <input class = "Amount" style = "width: 40px" value = "0"> <button id = "butPl"> + </button> </p>
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
	
	let Price = event.target.parentNode.parentNode.children[3].children[0].innerText;
	console.log(Price);
	
	AllPrice = Number(AllPrice) + Number(Price);
	console.log(AllPrice);
	
	let Total = document.getElementById('Total');
	console.log(Total);
	
	Total.innerHTML = '';
	
	let newH2 = document.createElement('H2');
	
	newH2.innerHTML = `
	Итого: ${AllPrice} Рубля(лей)
	`
	
	Total.append(newH2);
}

function minus(){
	if (event.target.parentNode.children[1].value > 0){
		event.target.parentNode.children[1].value--;
		
		let Price = event.target.parentNode.parentNode.children[3].children[0].innerText;
		console.log(Price);
		
		AllPrice = Number(AllPrice) - Number(Price);
		console.log(AllPrice);
		
		let Total = document.getElementById('Total');
		
		Total.innerHTML = '';
		
		let newH2 = document.createElement('H2');
		
		newH2.innerHTML = `
		Итого: ${AllPrice} Рубля(лей)
		`
		
		Total.append(newH2);
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
	
	Places.innerHTML = `
		<div style = "background-color: royalblue; color: white" class = "row border border-primary ml-3 mr-3">
			<div class = "col-3">
				<h5> Название </h5>
			</div>
					
			<div class = "col-3">
				<h5> Тип </h5>
			</div>
					
			<div class = "col-4">
				<h5> Адрес </h5>
			</div>
					
			<div class = "col-2">
				<h5> Действия </h5>
			</div>
		</div>	
	`
	
	
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
			newDiv.className = "row border border-primary ml-3 mr-3";
			
			newDiv.innerHTML = `
				<div class = "col-3 mt-3">
					<h6> ${Res[i].name} </h6>
				</div>
						
				<div class = "col-2 mt-3">
					<h6> ${Res[i].typeObject} </h6>
				</div>
						
				<div class = "col-4 mt-3 text-danger">
					<h6> ${Res[i].address} </h6>
				</div>
						
				<div class = "col-3 mt-2">
					<button class = "form-control but"> Выбрать </button>    
				</div>
			`
			
			Places.append(newDiv); //Class na ID(334)
			counter++;
			
			if (counter == 20){
				break;
			}
		}
	}
	
	let Choose = document.querySelectorAll('.but');
	//console.log(Choose);
	for (let butt of Choose){ 
		butt.addEventListener('click', Chooser);
	}
}

function discount(){
	if (AllPrice == 0){
		return;
	}
	
	let Student_d = document.getElementById('Student');
	
	if (Student_d.checked){
		let percent1 = AllPrice / 10;
		AllPrice = AllPrice - percent1;
	}
	else{
		let percent1 = AllPrice / 9;
		AllPrice = AllPrice + percent1;
	}
	
	AllPrice = Math.round(AllPrice);
	
	let Total = document.getElementById('Total');
	Total.innerHTML = '';	
	let newH2 = document.createElement('H2');
	newH2.innerHTML = `
	Итого: ${AllPrice} Рубля(лей)
	`
	Total.append(newH2);
}

function fast(){
	if (AllPrice == 0){
		return;
	}
	
	let Fast_d = document.getElementById('Fast');  //100 20  120
	
	if (Fast_d.checked){
		let percent2 = AllPrice / 5;
		AllPrice = AllPrice + percent2;
	}
	else{
		let percent2 = AllPrice / 6;
		AllPrice = AllPrice - percent2;
	}
	
	AllPrice = Math.round(AllPrice);
	
	let Total = document.getElementById('Total');
	Total.innerHTML = '';	
	let newH2 = document.createElement('H2');
	newH2.innerHTML = `
	Итого: ${AllPrice} Рубля(лей)
	`
	Total.append(newH2)
}

function addModalWin(){
	let inputs = document.querySelectorAll('.text-center > input');
	console.log(inputs);
	
	let Rest_dishes = document.getElementById('positions');
	
	Rest_dishes.innerHTML = '';
	
	for (let val in inputs){
		if (inputs[val].value > 0){
			let newDiv = document.createElement('div');
			newDiv.className = "row border border-primary mt-2 ml-2 mr-2";
			
			let picture = inputs[val].parentNode.parentNode.children[0].children[0].src;
			let dish_name = inputs[val].parentNode.parentNode.children[1].innerText;
			let price = inputs[val].parentNode.parentNode.children[3].children[0].innerText;
			console.log(price);
			
			let amount = inputs[val].value;
			
			let Total = Number(price) * Number(amount);
			
			console.log(dish_name);
			
			newDiv.innerHTML = `
				<div class = "col-2 pl-1">
					<div class = "mt-2 pl-1 mb-2"> <img src = ${picture} width = "50px" height = "50px" class = "border border-danger"> </div>
				</div>
			
				<div class = "col-3 mt-2">
					<p class = "Dish_name mt-2"> <b> ${dish_name} </b> </p>
				</div>
			
				<div class = "col-4 mt-2">
					<div class = "Kol mt-3"> ${amount} x ${price} Р. </div>
				</div>
				
				<div class = "col-3">
					<div class = "mt-2 Tot"> Суммарно: ${Total} Р. </div>
				</div>
			`
			
			Rest_dishes.append(newDiv);
		}
	}
	
	let Options_div = document.getElementById('Special');
	let checkboxes = document.querySelectorAll('input[type="checkbox"]')
	
	Options_div.innerHTML = '';
	
	console.log(checkboxes);
	
	for (let box of checkboxes){
		if (box.checked){
			let newDiv = document.createElement('div');
			newDiv.className = "row border-left border-primary ml-2";
			
			let opt_name = box.parentNode.parentNode.parentNode.children[0].children[0].innerText;
			let opt_priv = box.parentNode.parentNode.parentNode.children[0].children[1].innerText;
		
			newDiv.innerHTML = `
				<div class = "col-6">
					<p class = "mt-2"> ${opt_name}: </p>
				</div>
				
				<div class = "col-6">
					<p class = "mt-2"> <span class = "Rest"> ${opt_priv} </span> </p>
				</div>
			`
			
			Options_div.append(newDiv);
		}
	}
	
	let Rest_info = document.getElementById('Rest_info');
	console.log(Restaurant);
	
	Rest_info.innerHTML = '';
	
	let newDiv = document.createElement('div');
	newDiv.innerHTML = `
	<div class = "row border-left border-primary ml-2">
		<div class = "col-12">
			<p> Название: <span class = "Rest"> ${Restaurant.name} </span> </p>
		</div>
		
		<div class = "col-12">
			<p> Адм. Округ: <span class = "Rest"> ${Restaurant.admArea} </span> </p>
		</div>
		
		<div class = "col-12">
			<p> Район : <span class = "Rest"> ${Restaurant.district} </span> </p>
		</div>
		
		<div class = "col-12">
			<p> Адрес: <span class = "Rest"> ${Restaurant.address} </span> </p>
		</div>
		
		<div class = "col-12">
			<p> Рейтинг: <span class = "Rest"> ${Restaurant.rate} </span> </p>
		</div>
	</div>	
	`
	
	Rest_info.append(newDiv);
	
	let Dostavka = document.getElementById('Dostavka');
	console.log(Dostavka);
	
	let newDost = document.createElement('div');
	newDost.innerHTML = `
	<div class = "row border-left border-primary ml-2">
		<div class = "col-6">
			<p> Зона доставки </p>
		</div>
		
		<div class = "col-6">
			<p> 
				<select>
					<option> Не выбрано </option>
					<option> Первая зона </option>
					<option> Вторая зона </option>
					<option> Третья зона </option>
				</select>
			</p>
		</div>
		
		<div class = "col-6">
			<p> Адрес доставки </p>
		</div>
		
		<div class = "col-6">
			<textarea> </textarea>
		</div>
		
		<div class = "col-6">
			<p>Стоимость доставки</p>
		</div>
		
		<div class = "col-6 mt-2">
			<p class = "Rest"> <span> 250 </span> Р. </p>
		</div>
		
		<div class = "col-6 mt-2">
			<p>ФИО получателя</p>
		</div>
		
		<div class = "col-6">
			<textarea> </textarea>
		</div>
		
		<div class = "col-6 mt-2">
			<p>Итого</p>
		</div>
		
		<div class = "col-6 mt-2">
			<p class = "Money text-danger"> ${AllPrice+250} Р. </p>
		</div>
	</div>	
	`
	
	Dostavka.append(newDost);
	
}

function SortByA(result){
	for (let i = 0; i < result.length - 1; i++){
		for (let j = 0; j < result.length - 1; j++){
			if (result[j] > result[j+1]){
				let temp = result[j];
				result[j] = result[j+1]
				result[j+1] = temp;
			}
		}
	}
}

function Checker(){
	let values = document.querySelectorAll('.Amount');
	for (let key in values){
		if (values[key].value > 0){
			return;
		}
	}
	
	AllPrice = 0;
	
	let Total = document.getElementById('Total');
	Total.innerHTML = '';	
	let newH2 = document.createElement('H2');
	newH2.innerHTML = `
	Итого: ${AllPrice} Рубля(лей)
	`
	Total.append(newH2);
}

setInterval(Checker, 250);
getRestaurants()
finder.addEventListener('click', findRestaurants);
Student_d.addEventListener('click', discount);
Fast_d.addEventListener('click', fast);
last_but.addEventListener('click', addModalWin);


