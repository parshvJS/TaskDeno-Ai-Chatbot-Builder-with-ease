<!-- Feature to impletemet -->

<!-- Core -->
1. user can create workflows (frontend)
    i. have staring point
    ii. can create new nodes
    iii. add instructions to new node
    iv. connect nodes and create custom workflow

2. integreat workflow to own website(frontend)
    i. for each chatbot user will have own script tag to add
    ii. just add tag and website will have chatbot

3. deploy appearence to each website(backend)
    i. script tag must have sence to deploy correct 
    ii. and operate concerently

<!-- orbital -->

1. customize appearence (full)
    i user can customize chatbot
    ii. add changes to database 

2. Conversation (full)
    i. user can see all conversation happen 

3. analytic & usage dashboard feature 

4. Template library

<!-- optional -->

1. documentation 

<!-- ++++++++++++++++         Calander           +++++++++++++++++ -->

<!--####### 5 week - 34 days left #######-->

1. 5 - 07 - 24 (complete and store builder )
        ✅i. create initital implementation of all core feature
        ✅ii. fix context fault    
        iii. Start - Adding task To workflow
            - create side bar
            - define schema
        iv. complete whole builder thing
            - all node and edge operation
            - adding and removing instructions 
            - adding and removing nodes and edges
            - whole syncing to database efficietly

2. 6 - 07 - 24
    i. work on executing individual chatbot 

1.on page load context will store some data to project - pending
2.page load step 1 executes
3. when step 1 is complete the n and e will be added to state



<!-- intarect with builder  -->
1.previou data getting
2.mounting previous data

i. changing node 
ii. refreshing project

O. taking project data
OO. Saving in database


<!-- How -->

1. getPrevious data
2. useEffect - dep - [project] -working - take data from project and mount on node state

i. onNodechange & onEdgeChange 
ii. - pass hook to sidePanel
    - when save is clicked - func - addChangesToContext

O.  context func - storeChangesInDb


<!-- adding task to workflow -->

1. each node will have following field as per requirement in data of node
    Template : 
    NODE:
        data : {
            nodeName:"group #dR_g"
            response,ai:{
                type:text,
                content:"xyz",
                variable : variables[x]
            },
            user:{
                type:text,
                variable:variables[y]
            }
        }
    EDGE:
        {id:"dsf", source:"node1",des:"node2"}

    i. sent manual response field
        - Text : data :{ 
            type:"text",
            content:"how can i assist you",
            variable:"greeting"
        }

        - Image : data:{
            type:"image",
            content:"https://image.com/image",
        }

    ii. user field

        -Text : data:{
            user:{
                type:"Text",
                variable:variables[y]
            }
        }

        -phone : data:{
            user:{
                type:"phone",
                variable:variables[y]
            }
        }

        -number : data:{
            user:{
                type:"number",
                variable:variables[y]
            }
        }

        -email : data:{
            user:{
                type:"email",
                variable:variables[y]
            }
        }

        -form : data:{
            user:{
                type:"form",
                content:"Please Fill This Form",
                form:[
                    {
                        label:"abc",
                        type:["text","phone","number","email"]
                        variable:variables[x]
                    }
                ]
            }
        }

    iii. ai response

    -AI :
    data:{
        ai:{
            type:"text",
            aiPrompt:""
            question:"",
            variable:variables[x]
        }
    }

2. whole node and edge structure will be stored in database

<!-- how -->

1.create right side bar 
2.when user click on any node,side bar will be active
3.that side bar will have 2 things
    i. response 
        Type : ["text","image"]
        content
        variable
    OR
    i. AI
        question
        instruction
        model
        variable
    
    ii. user:
        type
        variable
        min
        max

4. show data as per user in react flow nodes and edges



<!-- output -->

1. instructions on each node 

2. interaction with node using sidebar

3. storing in above schema


<!-- approuch -->

1. create RightSideBar component
2. data field of any node
3. context of project

<!-- working -->

i. when nodes are created add initital values to it


1. create initital sidebar
2. create context : 
{
    isSidebarActive
    activeNodeId,
    node object of current id
}

3. create side bar take node id and mount current content

4. manipulate content using side bar and update is in node

5. at last we have 1. side bar 2. node with data manup using sidebar 3. nodes stored in context and can change things 



<!-- Execute chatbot -->

1. embed api will be executed 
2. return code for appearence (how chatbot icon and chatbox appears)
3. starter message will be shown
4. user share some input
5. check the new node to execute through edge
6. execture that node and sent response 
7. repeat till chatbot ends
8. store all data in cn


<!-- how -->

1. create 2 apis 
    1. getChatbot script
    2. get chatbot data
    3. get chatbot response

2. create neccessary script and scalable html css bundle and deploy 

<!-- analytics -->

1. retrive id of chatbot
2. total following fields will be shown
    i.total number of conversation completed
    ii. total number of re direction
    iii. total leads capture
    iv. total number of user found it help full
3. show them in count and graph form 

<!-- how -->

1.use high level library for graphs and query
2.calculate data and show 


<!-- conversation -->

1. get id of chatbot
2. retrive conversation of chatbot

<!-- appearence -->

1.user can customize following things
    i. chatbot logo
    ii. ai logo
    iii. color theme (1 color)
    iv. margin of l,r,b
2. store this changes in chatbot initial data 
3. create chatbot embeddings as per here


<!-- how -->

1.first create dashboard to do show such thing
2.store in chatbot database
3. when passing script to chatbot just make changes in template and pass


<!-- Template library -->

1. store some work flows as templates
2. when user want to use template just create another chatbot in user account and store those nodes and edges as their initial value



<!-- feature create node instructions -->

1.sync :  nodetype , rightsidebar ,node
2. rightsidebar -> context --> nodetype -> node
3. 

<!-- todo -->

1. add functionality to add and manipulate node data
   handle total 3 data units 
   -add initital data gram for nodes
   -add data manipulating features
   -store in database
   -refine edge connectors and looping

2. store all data in proper format in database

3. script tag creation 
    - script tag embeding 
   - create embed.js api and that fetches workflow create html with starter message and sent it as      response.
 
4. create cluster bases architecture - performance
   create static app




<!-- temp -->

1. chatbot

1.variable
2.dt
3.icon on node
4.node type update

<!-- temp 2 -->
1.variable i. chatbot ii.user - value - chatbotValue
2.datatype - chatbotdatatype
3.

<!-- TEMP 3 -->

1. create chatbot manip (commit after each complete)
-  set data field in state - chatbotData
-  when chatbotData changes - useEffect calls and let data to sidebar - sidebar to nodes and page
O.  image 
    - ip : image url
OO. text
    -ip : text to show
OOO. email
    -ip : email address
OOOO. number
    -ip : number
OOOOO. phone
    -ip phone number


