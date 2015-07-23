var TicketBox = React.createClass({
  loadTicketsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
 handleTicketsSubmit: function(ticket) {
    var tickets = this.state.data;
    var newTickets = tickets.concat([ticket]);
    this.setState({data: newTickets});
	$.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: ticket,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadTicketsFromServer();
    setInterval(this.loadTicketsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="ticketBox">
        <h1>All the lib</h1>
        <TicketList data={this.state.data} />
        <TicketForm onTicketSubmit={this.handleTicketsSubmit} />
      </div>
    );
  }
});





var TicketList = React.createClass({
  render: function() {
    var ticketNodes = this.props.data.map(function (ticket) {
      return (
        <Ticket LibName={ticket.LibName}>
		{ticket.Disc}
          {ticket.Pic}
        </Ticket>
      );
    });
    return (
      <div className="ticketList">
        {ticketNodes}
      </div>
    );
  }
});




var Ticket = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="ticket" >
        <h2 className="LibName">
          {this.props.LibName}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

var TicketForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var LibName = React.findDOMNode(this.refs.LibName).value.trim();
	var Disc = React.findDOMNode(this.refs.Disc).value.trim();
    var Pic = React.findDOMNode(this.refs.Pic).value.trim();
    if (!Pic || !LibName ||!Disc) {
      return;
    }
    this.props.onTicketSubmit({LibName: LibName, Pic: Pic, Disc:Disc});
    React.findDOMNode(this.refs.LibName).value = '';
	 React.findDOMNode(this.refs.Disc).value = '';
    React.findDOMNode(this.refs.Pic).value = '';
    return;
  },
  render: function() {
    return (
      <form  action="add_ticket.php" className="ticketForm" onSubmit={this.handleSubmit}>
		<input type="text" placeholder="Name" ref="LibName" name="LibName" />
        <input type="text" placeholder="Discription" ref="Disc" name="LibInfo" />
        <input type="text" placeholder="Picture" ref="Pic"name="LibPic" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.render(
  <TicketBox url="tickets.json" pollInterval={2000} />,
  document.getElementById('content')
);