var animationSpeed = 750;
var library = [];

$(document).ready(function(){
    fillLibrary();
    attachAnimations();    
});

/* -----------------------------------------------------------------------------
    FILL PAGE HTML 
   ---------------------------------------------------------------------------*/
function fillLibrary() {
    assembleData();
    var classlist = ['left-side first','left-side','left-side','right-side','right-side','right-side last'];
        for (i=0; i < library.length; i++) {
            var book = library[i];
            // add html for current book
            var html = '<li class="book ' + classlist[0] + '">';
            html += '<div class="cover"><img src="' + book.cover + '" /></div>';
            html += '<div class="summary">';
            html += '<h1>' + book.title + '</h1>';
            html += '<h2>by ' + book.author + '</h2>';
            html += '<p>' + book.abstract + '</p>';
            html += '</div></li>';
            $('.library').append(html);
            // shift the classlist array for the next iteration
            var cn = classlist.shift();
            classlist.push(cn);
        }
   
}
/* -----------------------------------------------------------------------------
    ANIMATION 
   ---------------------------------------------------------------------------*/
function attachAnimations() {
    $('.book').click(function(){
        if (!$(this).hasClass('selected')) {
            selectAnimation($(this));
        }
    });
    $('.book .cover').click(function(){
        if ($(this).parent().hasClass('selected')) {
           deselectAnimation($(this).parent());
        }
    });
}

function selectAnimation(obj) {
    obj.addClass('selected');
    // elements animating
    var cover = obj.find('.cover');
    var image = obj.find('.cover img');
    var library = $('.library');
    var summaryBG = $('.overlay-summary');
    var summary = obj.find('.summary');
    // animate book cover
    cover.animate({
        width: '300px',
        height: '468px' 
    }, {
        duration: animationSpeed
    });
    image.animate({
        width: '280px',
        height: '448px',
        borderWidth: '10px'
    },{
        duration: animationSpeed
    });
    // add fix if the selected item is in the bottom row
    if (isBtmRow()){
      library.css('paddingBottom','234px');
    }
    // slide page so book always appears
    positionTop();
    // add background overlay
    $('.overlay-page').show();
    // locate summary overlay    
    var px = overlayVertPos();
    summaryBG.css('left',px);
    // animate summary elements
    var ht = $('.content').height();
    var pos = $('.book.selected').position();
    var start = pos.top + 30; // 10px padding-top on .book + 20px padding of .summary
    var speed = Math.round((animationSpeed/ht) * 450); // 450 is goal height
    summaryBG.show().animate({
        height: ht + 'px'
    },{
        duration: animationSpeed,
        easing: 'linear',
        step: function(now,fx){
            if (now > start && fx.prop === "height"){
                if(!summary.is(':animated') && summary.height() < 450){
                    summary.show().animate({
                        height: '450px'
                    },{
                        duration: speed,
                        easing: 'linear'
                    });
                }
                
            }
        } 
        
    });
}

function deselectAnimation(obj) {
    // elements animating
    var cover = obj.find('.cover');
    var image = obj.find('.cover img');
    var library = $('.library');
    var summaryBG = $('.overlay-summary');
    var summary = obj.find('.summary');
    // stop summary animation
    summary.stop();
    // animate book cover
    cover.stop().animate({
        width: '140px',
        height: '224px' 
    },{
        duration:animationSpeed
    });
    image.stop().animate({
        width: '140px',
        height: '224px',
        borderWidth: '0px'
    },{
        duration: animationSpeed,
        complete: function() {
            obj.removeClass('selected');
        }
    });
    // remove fix for bottom row, if present
    library.stop().animate({
        paddingBottom:'10px'
    },{ 
        duration: animationSpeed
    });
    // remove background overlay and summary
    var ht = summaryBG.height();
    var pos = $('.book.selected').position();
    var start = pos.top + 480; //10px of top padding + 470px for .summary height + padding
    var speed = Math.round((animationSpeed/ht) * summary.height());
    summaryBG.stop().animate({
        height: '0px'
    },{
        duration: animationSpeed,
        easing: 'linear',
        step: function(now,fx){
            if (now < start && fx.prop === "height"){
                if(!summary.is(':animated') && summary.height() > 0){
                    summary.animate({
                        height: '0px'
                    },{ 
                        duration: speed,
                        easing: 'linear',
                        complete: function(){
                            summary.hide(); 
                        }
                    });
                }
                
            }
        }, 
        complete: function(){
            $('.overlay-page').hide();
            summary.hide(); // catching this twice to insure for aborted animation
            summaryBG.hide();
        }
    });
}

function isBtmRow() {
    var pos = $('.book.selected').position();
    var libHgt = $('.content').height();
    if (libHgt-pos.top===254) { // this is current height of the book, plus 30 for padding on the book and library
        return true;
    } else {
        return false;
    }
}

function positionTop() { 
   var offset = $('.book.selected').offset();
   var bTop = offset.top;
   $('html, body').animate({ scrollTop: bTop }, animationSpeed);
}

function overlayVertPos() { // determines the vertical position for the summary overlay based on selection position
    var pos = $('.book.selected').position();
    switch(pos.left) {
        case 0:
            return '320px';
        case 160:
            return '320px';
        case 320:
            return '480px';
        case 480:
            return '0px';
        case 640:
            return '160px';
        case 800:
            return '160px';
        default:
            return false;
    }
}
/* -----------------------------------------------------------------------------
    BUILD LIBRARY ARRAY 
   ---------------------------------------------------------------------------*/
function Book(cover,title,author,abstract) {
    this.cover = cover;
    this.title = title;
    this.author = author;
    this.abstract = abstract;
    library.push(this);
}

function assembleData() {
    var book;
    book = new Book('../../resources/command-and-control.jpg','Command and Control: Nuclear Weapons, the Damascus Accident, and the Illustion of Saftey','Eric Schlosser','A New York Times Bestselling Author Famed investigative journalist Eric Schlosser digs deep to uncover secrets about the management of America\'s nuclear arsenal. A groundbreaking account of accidents? near misses? extraordinary heroism? and technological breakthroughs? Command and Control explores the dilemma that has existed since the dawn of the nuclear age? yet has never been resolved: How do you deploy weapons of mass destruction without being destroyed by them?');
    book = new Book('../../resources/collins-dictionary-of-physics.jpg','Collins Dictionary of Physics','Eric Deeson','Covering an enormous range of technical terms from both pure and applied physics, this superb reference goes beyond basic definitions to provide helpful explanations and examples.');
    book = new Book('../../resources/the-birth-of-a-new-physics','The Birth of a New Physics','I Bernard Collen','Relates man\'s search from the sixteenth century to the present for a physics to describe the dynamics of a universe in motion.');
    book = new Book('../../resources/counterinsrugency-warfare.jpg','Counterinsurgency Warfare: Theory and Practice','David Galua, John Nagl','This volume in the Praeger Security International (PSI) series Classics of the Counterinsurgency Era defines the laws of insurgency and outlines the strategy and tactics to combat such threats. Drawn from the observations of a French officer, David Galula, who witnessed guerrilla warfare on three continents, the book remains relevant today as American policymakers, military analysts, and members of the public look to the counterinsurgency era of the 1960s for lessons to apply to the current situation in Iraq and Afghanistan.');
	book = new Book('https://bit.ly/2SVijWF','The Woman Warrior','Maxine Hong Kingston','A Chinese American woman tells of the Chinese myths, family stories and events of her California childhood that have shaped her identity. It is a sensitive account of growing up female and Chinese-American in a California laundry.');
	book = new Book('https://bit.ly/2J5Z90p','Quantum Reality: Beyond the New Physics','Nick Herbert','This clearly explained layman\'s introduction to quantum physics is an accessible excursion into metaphysics and the meaning of reality. Herbert exposes the quantum world and the scientific and philosophical controversy about its interpretation.');
	book = new Book('https://bit.ly/2u0O2LR','Women in War','Shelley Saywell','');
	book = new Book('https://bit.ly/2J4L7fC','The Art of Intelligence: Lessons from a Life in the CIA\'s Clandestine Service','Henry Crumpton','Henry A. "Hank" Crumpton, a twenty-four-year veteran of the CIA\'s Clandestine Service, offers a thrilling account that delivers profound lessons about what it means to serve as an honorable spy. From CIA recruiting missions in Africa to pioneering new programs like the UAV Predator, from running post9/11 missions in Afghanistan to heading up all clandestine CIA operations in the United States, Crumpton chronicles his rolein the battlefield and in the Oval Officein transforming the way America wages war and sheds light on issues of domestic espionage.');
	book = new Book('https://bit.ly/2O0sIzA','The Middle East: A Brief History of the Last 2,000 Years','Bernard Lewis','He shows how, during the twentieth century, imported Western ideas such as liberalism, fascism, socialism, patriotism, and nationalism have transformed Middle Easterners\' ancient notions of community, their self-perceptions, and their aspirations. To this fascinating historical portrait, Lewis brings an understanding of the region and its peoples, as well as a profound sympathy for the plight that the modern world has imposed on them. The result is an invaluable tool in our understanding of an area that is of increasing global importance and concern today.');
	book = new Book('https://bit.ly/2NYm2St','Parisians: An Adventure History of Paris','Graham Robb','A young artillery lieutenant, strolling through the Palais-Royal, observes disapprovingly the courtesans plying their trade. A particular woman catches his eye; nature takes its course. Later that night Napoleon Bonaparte writes a meticulous account of his first sexual encounter. A well-dressed woman, fleeing the Louvre, takes a wrong turn and loses her way in the nameless streets of the Left Bank.');
	book = new Book('https://bit.ly/2NXx9eg','The Secret History of the CIA','Joseph Trento','Chronicles the origins and history of the Central Intelligence Agency and analyzes the performance of its leaders and members during the Cold War, including Soviet double agent Igor Orlov and mole hunter James Angleton.');
	book = new Book('https://bit.ly/2TyUc5a','Elizabeth Cady Stanton: Social Former','Michel Burgan','A biography profiling the life of Elizabeth Cady Stanton, a staunch supporter of women\'s rights who helped plan the historic woman\'s rights convention in Seneca Falls, New York, in 1848. Includes source notes and timeline.');
	book = new Book('','','','');
	book = new Book('','','','');
	book = new Book('','','','');
	book = new Book('','','','');
	book = new Book('','','','');
	book = new Book('','','','');
	book = new Book('','','','');
	book = new Book('','','','');
	book = new Book('','','','');
	book = new Book('','','','');
	book = new Book('','','','');
	book = new Book('','','','');
}
